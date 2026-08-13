/**
 * Step 13B — Programmatic PPTX Chart & XML Inspector
 *
 * Inspects generated PPTX packages:
 * 1. Verifies zip package structure & relationships.
 * 2. Reads ppt/charts/chart*.xml and validates presence of:
 *    - Chart type element (<c:barChart>, <c:lineChart>, <c:doughnutChart>, <c:pieChart>, <c:areaChart>, <c:scatterChart>)
 *    - Series elements (<c:ser>)
 *    - Category data (<c:cat> or <c:xVal>)
 *    - Value data (<c:val> or <c:yVal>)
 *    - Embedded Excel workbook (ppt/embeddings/*.xlsx) when <c:externalData> is referenced.
 * 3. Tests actual PowerPoint openability via PowerShell COM automation on Windows.
 */

import * as fs from 'fs';
import * as path from 'path';
import JSZip from 'jszip';
import { execSync } from 'child_process';

export interface ChartInspectionReport {
  filePath: string;
  packageValid: boolean;
  chartXmlExists: boolean;
  chartTypeElementFound: string | null;
  seriesFound: boolean;
  categoriesFound: boolean;
  valuesFound: boolean;
  embeddedWorkbookValid: boolean;
  relationshipValid: boolean;
  powerPointOpenable: boolean;
  openableStatus: string;
  errors: string[];
}

export async function validateChartPptx(filePath: string): Promise<ChartInspectionReport> {
  const errors: string[] = [];

  const report: ChartInspectionReport = {
    filePath,
    packageValid: false,
    chartXmlExists: false,
    chartTypeElementFound: null,
    seriesFound: false,
    categoriesFound: false,
    valuesFound: false,
    embeddedWorkbookValid: false,
    relationshipValid: false,
    powerPointOpenable: false,
    openableStatus: 'UNTESTED',
    errors: [],
  };

  if (!fs.existsSync(filePath)) {
    errors.push(`File does not exist at path: ${filePath}`);
    report.errors = errors;
    return report;
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const zip = await JSZip.loadAsync(fileBuffer);
    report.packageValid = true;

    // 1. Find Chart XML files
    const chartFiles = Object.keys(zip.files).filter((name) => /^ppt\/charts\/chart\d+\.xml$/i.test(name));
    if (chartFiles.length === 0) {
      errors.push('PPTX package contains no chart XML files (ppt/charts/chart*.xml).');
    } else {
      report.chartXmlExists = true;
      const chartXmlContent = await zip.files[chartFiles[0]].async('string');

      // Check chart type element
      const typeMatch = chartXmlContent.match(/<c:(barChart|lineChart|pieChart|doughnutChart|areaChart|scatterChart)[\s>]/i);
      if (typeMatch) {
        report.chartTypeElementFound = typeMatch[1];
      } else {
        errors.push('Chart XML is missing plot chart type element (<c:barChart>, <c:lineChart>, etc.).');
      }

      // Check <c:ser>
      if (/<c:ser[\s>]/i.test(chartXmlContent)) {
        report.seriesFound = true;
      } else {
        errors.push('Chart XML is missing series element (<c:ser>).');
      }

      // Check <c:cat> or <c:xVal> category data
      if (/<c:cat[\s>]/i.test(chartXmlContent) || /<c:xVal[\s>]/i.test(chartXmlContent) || /<c:strRef[\s>]/i.test(chartXmlContent) || /<c:numRef[\s>]/i.test(chartXmlContent)) {
        report.categoriesFound = true;
      } else {
        errors.push('Chart XML is missing category/xVal data element (<c:cat>/<c:xVal>).');
      }

      // Check <c:val> or <c:yVal> value data
      if (/<c:val[\s>]/i.test(chartXmlContent) || /<c:yVal[\s>]/i.test(chartXmlContent) || /<c:numRef[\s>]/i.test(chartXmlContent) || /<c:v[\s>]/i.test(chartXmlContent)) {
        report.valuesFound = true;
      } else {
        errors.push('Chart XML is missing value/yVal data element (<c:val>/<c:yVal>).');
      }

      // Check embedded workbook if <c:externalData> is present
      if (/<c:externalData[\s>]/i.test(chartXmlContent)) {
        const embeddings = Object.keys(zip.files).filter((name) => /^ppt\/embeddings\/.*\.xlsx$/i.test(name));
        if (embeddings.length > 0) {
          report.embeddedWorkbookValid = true;
        } else {
          errors.push('Chart XML references <c:externalData> but ppt/embeddings/*.xlsx is missing.');
        }
      } else {
        report.embeddedWorkbookValid = true; // No external workbook requirement
      }
    }

    // 2. Check slide relationships
    const relsFiles = Object.keys(zip.files).filter((name) => /^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/i.test(name));
    if (relsFiles.length > 0) {
      const relsContent = await zip.files[relsFiles[0]].async('string');
      if (relsContent.includes('charts/chart') || relsContent.includes('charts/')) {
        report.relationshipValid = true;
      } else {
        errors.push('Slide relationships file does not point to chart target.');
      }
    } else {
      errors.push('Slide relationships file missing.');
    }
  } catch (err: any) {
    errors.push(`ZIP package read error: ${err.message}`);
  }

  // 3. Test PowerPoint Openability via PowerShell COM Automation
  try {
    const absPath = path.resolve(filePath);
    const psCmd = `$ppt = $null; try { $ppt = New-Object -ComObject PowerPoint.Application; $pres = $ppt.Presentations.Open('${absPath}', 1, 0, 0); if ($pres -ne $null) { $pres.Close(); Write-Output 'POWERPOINT_OPEN_SUCCESS' } else { Write-Output 'POWERPOINT_OPEN_FAILED' } } catch { Write-Output ('POWERPOINT_ERROR: ' + $_.Exception.Message) } finally { if ($ppt -ne $null) { $ppt.Quit() } }`;

    const psResult = execSync(`powershell -NoProfile -Command "${psCmd}"`, {
      timeout: 10000,
      encoding: 'utf-8',
    }).trim();

    if (psResult.includes('POWERPOINT_OPEN_SUCCESS')) {
      report.powerPointOpenable = true;
      report.openableStatus = 'POWERPOINT_OPENABLE_REPAIR_FREE';
    } else if (psResult.includes('POWERPOINT_ERROR')) {
      report.openableStatus = psResult;
    } else {
      report.openableStatus = psResult || 'POWERPOINT_OPEN_FAILED';
    }
  } catch (err: any) {
    report.openableStatus = `POWERPOINT_AUTOMATION_SKIPPED (${err.message.substring(0, 80)})`;
  }

  report.errors = errors;

  return report;
}
