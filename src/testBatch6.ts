/**
 * BATCH 6 — MICROSOFT POWERPOINT OPENABILITY FIX & DIAGNOSTIC
 *
 * Step 16: Fix OpenXML transition placement sequence:
 *          ECMA-376 schema requires: <p:cSld> -> <p:clrMapOvr> -> <p:transition> -> <p:timing> -> </p:sld>
 *          (Placing <p:transition> before <p:clrMapOvr> is invalid schema order).
 *
 * Step 17: PowerPoint Openability Testing on both:
 *          A. batch5-precision-agriculture.pptx (production static deck)
 *          B. step15-transition-test.pptx (transition enhanced deck)
 *
 * Step 18 (if needed): Media format compatibility inspection (SVG vs PNG/JPEG).
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import JSZip from 'jszip';
import { generateTransitionXml, applySlideTransitions, enhancePresentationFile } from './export/transitionEnhancer';

export interface PowerpointOpenResult {
  openSuccess: boolean;
  slideCount: number;
  errorMessage?: string;
  exportedPng?: string;
}

export function testPowerPointOpen(pptxPath: string, pngExportPath?: string): PowerpointOpenResult {
  const absPptx = path.resolve(pptxPath);
  const tempDir = path.dirname(absPptx);
  const tempPs1 = path.join(tempDir, `temp_verify_${Date.now()}_${Math.floor(Math.random() * 1000)}.ps1`);

  const exportSnippet = pngExportPath
    ? `$pres.Slides.Item(1).Export('${path.resolve(pngExportPath)}', 'PNG', 1280, 720)`
    : '';

  const psScript = `
    $ppt = $null
    try {
      $ppt = New-Object -ComObject PowerPoint.Application
      $pres = $ppt.Presentations.Open('${absPptx}', 1, 0, 0)
      if ($pres -ne $null) {
        $count = $pres.Slides.Count
        ${exportSnippet}
        $pres.Close()
        Write-Output ("VERIFY_SUCCESS:" + $count)
      }
    } catch {
      Write-Output ("VERIFY_ERROR:" + $_.Exception.Message)
    } finally {
      if ($ppt -ne $null) {
        $ppt.Quit()
      }
    }
  `;

  try {
    fs.writeFileSync(tempPs1, psScript, 'utf-8');
    const out = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempPs1}"`, {
      timeout: 20000,
      encoding: 'utf-8',
    }).trim();

    try { fs.unlinkSync(tempPs1); } catch {}

    if (out.includes('VERIFY_SUCCESS:')) {
      const countMatch = out.match(/VERIFY_SUCCESS:(\d+)/);
      const count = countMatch ? parseInt(countMatch[1], 10) : 0;
      return {
        openSuccess: true,
        slideCount: count,
        exportedPng: pngExportPath && fs.existsSync(pngExportPath) ? pngExportPath : undefined,
      };
    } else {
      const errMatch = out.match(/VERIFY_ERROR:(.*)/);
      return {
        openSuccess: false,
        slideCount: 0,
        errorMessage: errMatch ? errMatch[1].trim() : out,
      };
    }
  } catch (err: any) {
    try { fs.unlinkSync(tempPs1); } catch {}
    return {
      openSuccess: false,
      slideCount: 0,
      errorMessage: err.message,
    };
  }
}
