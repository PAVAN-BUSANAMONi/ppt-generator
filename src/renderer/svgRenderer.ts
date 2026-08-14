/**
 * SVG Renderer — converts SlideDefinition (1280x720 space) into SVG string.
 * Used for slide previews, PNG rendering, and montage creation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { SlideDefinition, SlideElement, TextElement, ShapeElement, ImageElement, TableElement, ChartElement } from '../core/types';

function hexColor(color?: string): string {
  if (!color) return 'transparent';
  return color.startsWith('#') ? color : `#${color}`;
}

export function renderSlideToSvg(slide: SlideDefinition): string {
  const width = 1280;
  const height = 720;
  const scale = 96; // 1 inch = 96 px

  const bg = slide.background ? hexColor(slide.background) : '#F7FBF8';

  let svgElements = '';

  for (const el of slide.elements) {
    switch (el.kind) {
      case 'shape':
        svgElements += renderShapeSvg(el, scale);
        break;
      case 'text':
        svgElements += renderTextSvg(el, scale);
        break;
      case 'image':
        svgElements += renderImageSvg(el, scale);
        break;
      case 'table':
        svgElements += renderTableSvg(el, scale);
        break;
      case 'chart':
        svgElements += renderChartSvg(el, scale);
        break;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${bg}" />
    ${svgElements}
  </svg>`;
}

function renderShapeSvg(el: ShapeElement, scale: number): string {
  const x = el.position.x * scale;
  const y = el.position.y * scale;
  const w = el.size.w * scale;
  const h = el.size.h * scale;

  const fill = hexColor(el.fill);
  const stroke = el.stroke ? hexColor(el.stroke) : 'none';
  const strokeWidth = el.strokeWidth ?? 1;

  if (el.shapeType === 'line') {
    return `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y + h}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
  }

  if (el.shapeType === 'ellipse') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = w / 2;
    const ry = h / 2;
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
  }

  const rx = el.shapeType === 'rounded-rect' ? (el.rectRadius ? el.rectRadius * scale : 12) : 0;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}

function wrapTextToLines(text: string, maxChars: number): string[] {
  const rawLines = text.split('\n');
  const result: string[] = [];

  for (const raw of rawLines) {
    if (!raw.trim()) {
      result.push('');
      continue;
    }
    const words = raw.split(/\s+/);
    let cur = '';
    for (const w of words) {
      if (!cur) {
        cur = w;
      } else if ((cur + ' ' + w).length <= maxChars) {
        cur += ' ' + w;
      } else {
        result.push(cur);
        cur = w;
      }
    }
    if (cur) result.push(cur);
  }
  return result;
}

function renderTextSvg(el: TextElement, scale: number): string {
  const x = el.position.x * scale;
  const y = el.position.y * scale;
  const w = el.size.w * scale;
  const h = el.size.h * scale;

  const fontFace = el.style.fontFace ?? 'Aptos, sans-serif';
  const fontSize = (el.style.fontSize ?? 18) * 1.33; // pt to px
  const color = hexColor(el.style.color ?? '073B3A');
  const fontWeight = el.style.bold ? 'bold' : 'normal';
  const fontStyle = el.style.italic ? 'italic' : 'normal';
  const textAlign = el.style.align ?? 'left';

  let textAnchor = 'start';
  let textX = x;
  if (textAlign === 'center') {
    textAnchor = 'middle';
    textX = x + w / 2;
  } else if (textAlign === 'right') {
    textAnchor = 'end';
    textX = x + w;
  }

  let boxSvg = '';
  if (el.boxFill || el.boxStroke) {
    const fill = hexColor(el.boxFill);
    const stroke = hexColor(el.boxStroke);
    boxSvg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1" />`;
  }

  const paddingX = el.boxFill || el.boxStroke ? 12 : 0;
  const effectiveW = Math.max(20, w - paddingX * 2);
  const avgCharWidth = fontSize * 0.62;
  const maxChars = Math.max(10, Math.floor(effectiveW / avgCharWidth));

  if (typeof el.content === 'string') {
    const lines = wrapTextToLines(el.content, maxChars);
    const lineHeight = fontSize * 1.3;
    let startY = y + fontSize + (el.boxFill || el.boxStroke ? 6 : 0);

    let linesSvg = '';
    lines.forEach((lineText, idx) => {
      const lineY = startY + idx * lineHeight;
      linesSvg += `<text x="${textX + (textAlign === 'left' ? paddingX : textAlign === 'right' ? -paddingX : 0)}" y="${lineY}" font-family="${fontFace}" font-size="${fontSize}px" font-weight="${fontWeight}" font-style="${fontStyle}" fill="${color}" text-anchor="${textAnchor}">${escapeXml(lineText)}</text>`;
    });

    return `${boxSvg}${linesSvg}`;
  }

  // Multi-run text
  let runSvg = '';
  let currentY = y + fontSize + (el.boxFill || el.boxStroke ? 6 : 0);

  for (const run of el.content) {
    const rFontSize = (run.options?.fontSize ?? el.style.fontSize ?? 18) * 1.33;
    const rColor = hexColor(run.options?.color ?? el.style.color ?? '073B3A');
    const rWeight = run.options?.bold ? 'bold' : 'normal';
    const rStyle = run.options?.italic ? 'italic' : 'normal';
    const rLineHeight = rFontSize * 1.3;
    const rMaxChars = Math.max(10, Math.floor(effectiveW / (rFontSize * 0.62)));

    const bulletPrefix = run.options?.bullet ? '• ' : '';
    const lines = wrapTextToLines(bulletPrefix + run.text, rMaxChars);

    lines.forEach((lineText) => {
      if (lineText.trim()) {
        runSvg += `<text x="${textX + (textAlign === 'left' ? paddingX : textAlign === 'right' ? -paddingX : 0)}" y="${currentY}" font-family="${fontFace}" font-size="${rFontSize}px" font-weight="${rWeight}" font-style="${rStyle}" fill="${rColor}" text-anchor="${textAnchor}">${escapeXml(lineText)}</text>`;
      }
      currentY += rLineHeight;
    });
    currentY += 4;
  }

  return `${boxSvg}${runSvg}`;
}

function renderImageSvg(el: ImageElement, scale: number): string {
  const x = el.position.x * scale;
  const y = el.position.y * scale;
  const w = el.size.w * scale;
  const h = el.size.h * scale;

  let imgHref = el.data;
  if (!imgHref && el.path && fs.existsSync(el.path)) {
    try {
      const parsed = path.parse(el.path);
      const thumbPath = path.join(parsed.dir, `${parsed.name}_thumb.jpg`);
      const targetRenderPath = fs.existsSync(thumbPath) ? thumbPath : el.path;

      const ext = path.extname(targetRenderPath).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';
      const b64 = fs.readFileSync(targetRenderPath).toString('base64');
      imgHref = `data:${mime};base64,${b64}`;
    } catch {
      // ignore
    }
  }

  if (imgHref) {
    const clipId = `clip-${Math.abs(Math.round(x * 100 + y * 10))}`;
    return `<defs>
      <clipPath id="${clipId}">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" ry="12" />
      </clipPath>
    </defs>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" ry="12" fill="#E6F4F1" stroke="#B9D8D4" stroke-width="1" />
    <image href="${imgHref}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" />`;
  }

  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#DDF7EE" stroke="#B9D8D4" />
    <text x="${x + w / 2}" y="${y + h / 2}" font-family="Aptos, sans-serif" font-size="14px" fill="#52666A" text-anchor="middle">IMAGE PANEL</text>`;
}

function renderTableSvg(el: TableElement, scale: number): string {
  const x = el.position.x * scale;
  const y = el.position.y * scale;
  const w = el.size.w * scale;
  const h = el.size.h * scale;

  const rowCount = el.rows.length;
  const colCount = el.rows[0]?.length ?? 1;
  const cellH = h / rowCount;

  // Calculate pixel column widths
  let colWidthsPx: number[] = [];
  if (el.colWidths && el.colWidths.length === colCount) {
    colWidthsPx = el.colWidths.map((cw) => cw * scale);
  } else {
    colWidthsPx = Array(colCount).fill(w / colCount);
  }

  let tableSvg = '';

  el.rows.forEach((row, rIdx) => {
    let currentX = x;
    const cy = y + rIdx * cellH;

    row.forEach((cell, cIdx) => {
      const cellW = colWidthsPx[cIdx];
      const fill = hexColor(cell.options?.fill ?? (rIdx === 0 ? '052F35' : rIdx % 2 === 0 ? 'FFFFFF' : 'EFFBF5'));
      const textColor = hexColor(cell.options?.color ?? (rIdx === 0 ? 'FFFFFF' : '073B3A'));
      const fontWeight = cell.options?.bold || rIdx === 0 ? 'bold' : 'normal';
      const fontSize = (cell.options?.fontSize ?? 11) * 1.33;

      tableSvg += `<rect x="${currentX}" y="${cy}" width="${cellW}" height="${cellH}" fill="${fill}" stroke="#B9D8D4" stroke-width="1" />`;

      const maxChars = Math.max(6, Math.floor((cellW - 16) / (fontSize * 0.52)));
      const cellLines = wrapTextToLines(cell.text, maxChars);
      const lineHeight = fontSize * 1.25;
      const totalTextH = cellLines.length * lineHeight;
      const startTextY = cy + Math.max(fontSize, (cellH - totalTextH) / 2 + fontSize * 0.8);

      cellLines.forEach((lText, lIdx) => {
        tableSvg += `<text x="${currentX + 8}" y="${startTextY + lIdx * lineHeight}" font-family="Aptos, sans-serif" font-size="${fontSize}px" font-weight="${fontWeight}" fill="${textColor}">${escapeXml(lText)}</text>`;
      });

      currentX += cellW;
    });
  });

  return tableSvg;
}

function renderChartSvg(el: ChartElement, scale: number): string {
  const x = el.position.x * scale;
  const y = el.position.y * scale;
  const w = el.size.w * scale;
  const h = el.size.h * scale;

  const series = el.data[0];
  if (!series || !series.values || series.values.length === 0) return '';

  const rawColors = el.options?.chartColors ?? ['0F766E', '0284C7', 'C88A1E', '10B981', '52666A'];
  const colors = rawColors.map((c) => hexColor(c));
  let chartSvg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#FFFFFF" stroke="#B9D8D4" stroke-width="1" />`;

  if (el.options?.title) {
    chartSvg += `<text x="${x + w / 2}" y="${y + 24}" font-family="Aptos, sans-serif" font-size="14px" font-weight="bold" fill="#073B3A" text-anchor="middle">${escapeXml(el.options.title)}</text>`;
  }

  if (el.chartType === 'bar' || el.chartType === 'col') {
    // Bar chart rendering
    const padTop = 38;
    const padBottom = 30;
    const padSide = 25;
    const plotW = w - padSide * 2;
    const plotH = h - padTop - padBottom;
    const maxVal = Math.max(...series.values) * 1.15 || 100;
    const barCount = series.values.length;
    const barWidth = (plotW / barCount) * 0.6;
    const barGap = (plotW / barCount) * 0.4;

    series.values.forEach((val, idx) => {
      const barH = (val / maxVal) * plotH;
      const bx = x + padSide + idx * (barWidth + barGap) + barGap / 2;
      const by = y + padTop + (plotH - barH);
      const color = colors[idx % colors.length];

      chartSvg += `<rect x="${bx}" y="${by}" width="${barWidth}" height="${barH}" rx="4" fill="${color}" />`;
      chartSvg += `<text x="${bx + barWidth / 2}" y="${by - 5}" font-family="Aptos, sans-serif" font-size="11px" font-weight="bold" fill="${color}" text-anchor="middle">${val}%</text>`;

      if (series.labels && series.labels[idx]) {
        chartSvg += `<text x="${bx + barWidth / 2}" y="${y + h - 12}" font-family="Aptos, sans-serif" font-size="10px" fill="#52666A" text-anchor="middle">${escapeXml(series.labels[idx])}</text>`;
      }
    });

    return chartSvg;
  }

  // Doughnut / Pie chart rendering
  const cx = x + w / 2;
  const cy = y + h / 2 - 10;
  const radius = Math.min(w, h) * 0.32;
  const innerRadius = el.chartType === 'pie' ? 0 : radius * 0.55;

  const total = series.values.reduce((a, b) => a + b, 0);
  let startAngle = 0;

  series.values.forEach((val, idx) => {
    const sliceAngle = (val / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const ix1 = cx + innerRadius * Math.cos(endAngle);
    const iy1 = cy + innerRadius * Math.sin(endAngle);
    const ix2 = cx + innerRadius * Math.cos(startAngle);
    const iy2 = cy + innerRadius * Math.sin(startAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const color = colors[idx % colors.length];

    const d = innerRadius > 0
      ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    chartSvg += `<path d="${d}" fill="${color}" stroke="#FFFFFF" stroke-width="2" />`;
    startAngle = endAngle;
  });

  // Legend
  if (el.options?.showLegend && series.labels) {
    const legendY = y + h - 25;
    const totalLabels = series.labels.length;
    const itemW = w / totalLabels;

    series.labels.forEach((label, idx) => {
      const lx = x + idx * itemW + 10;
      const color = colors[idx % colors.length];
      chartSvg += `<rect x="${lx}" y="${legendY}" width="10" height="10" rx="2" fill="${color}" />`;
      chartSvg += `<text x="${lx + 14}" y="${legendY + 9}" font-family="Aptos, sans-serif" font-size="10px" fill="#52666A">${escapeXml(label)}</text>`;
    });
  }

  return chartSvg;
}

function escapeXml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
