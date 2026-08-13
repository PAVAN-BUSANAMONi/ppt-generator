/**
 * SVG Renderer — converts SlideDefinition (1280x720 space) into SVG string.
 * Used for slide previews, PNG rendering, and montage creation.
 */

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

function renderTextSvg(el: TextElement, scale: number): string {
  const x = el.position.x * scale;
  const y = el.position.y * scale;
  const w = el.size.w * scale;
  const h = el.size.h * scale;

  const fontFace = el.style.fontFace ?? 'Aptos, sans-serif';
  const fontSize = (el.style.fontSize ?? 18) * 1.33; // pt to px roughly
  const color = hexColor(el.style.color ?? '073B3A');
  const fontWeight = el.style.bold ? 'bold' : 'normal';
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
    boxSvg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1" />`;
  }

  if (typeof el.content === 'string') {
    const textY = y + fontSize;
    const escapedText = escapeXml(el.content);
    return `${boxSvg}<text x="${textX}" y="${textY}" font-family="${fontFace}" font-size="${fontSize}px" font-weight="${fontWeight}" fill="${color}" text-anchor="${textAnchor}">${escapedText}</text>`;
  }

  // Multi-run text
  let runSvg = '';
  let currentY = y + fontSize;
  for (const run of el.content) {
    const rFontSize = (run.options?.fontSize ?? el.style.fontSize ?? 18) * 1.33;
    const rColor = hexColor(run.options?.color ?? el.style.color ?? '073B3A');
    const rWeight = run.options?.bold ? 'bold' : 'normal';
    const lines = run.text.split('\n');

    lines.forEach((lineText, idx) => {
      if (lineText.trim()) {
        const bulletPrefix = run.options?.bullet ? '• ' : '';
        const escaped = escapeXml(bulletPrefix + lineText);
        runSvg += `<text x="${textX}" y="${currentY}" font-family="${fontFace}" font-size="${rFontSize}px" font-weight="${rWeight}" fill="${rColor}" text-anchor="${textAnchor}">${escaped}</text>`;
      }
      if (idx < lines.length - 1) {
        currentY += rFontSize * 1.3;
      }
    });
  }

  return `${boxSvg}${runSvg}`;
}

function renderImageSvg(el: ImageElement, scale: number): string {
  const x = el.position.x * scale;
  const y = el.position.y * scale;
  const w = el.size.w * scale;
  const h = el.size.h * scale;

  if (el.data && el.data.startsWith('data:image/svg+xml')) {
    return `<image href="${el.data}" x="${x}" y="${y}" width="${w}" height="${h}" />`;
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
  const cellW = w / colCount;

  let tableSvg = '';

  el.rows.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      const cx = x + cIdx * cellW;
      const cy = y + rIdx * cellH;
      const fill = hexColor(cell.options?.fill ?? (rIdx === 0 ? '052F35' : rIdx % 2 === 0 ? 'FFFFFF' : 'EFFBF5'));
      const textColor = hexColor(cell.options?.color ?? (rIdx === 0 ? 'FFFFFF' : '073B3A'));
      const fontWeight = cell.options?.bold || rIdx === 0 ? 'bold' : 'normal';

      tableSvg += `<rect x="${cx}" y="${cy}" width="${cellW}" height="${cellH}" fill="${fill}" stroke="#B9D8D4" stroke-width="1" />`;
      tableSvg += `<text x="${cx + 12}" y="${cy + cellH / 2 + 5}" font-family="Aptos, sans-serif" font-size="14px" font-weight="${fontWeight}" fill="${textColor}">${escapeXml(cell.text)}</text>`;
    });
  });

  return tableSvg;
}

function renderChartSvg(el: ChartElement, scale: number): string {
  const x = el.position.x * scale;
  const y = el.position.y * scale;
  const w = el.size.w * scale;
  const h = el.size.h * scale;

  const cx = x + w / 2;
  const cy = y + h / 2 - 15;
  const radius = Math.min(w, h) * 0.35;
  const innerRadius = radius * 0.55;

  const series = el.data[0];
  if (!series || !series.values || series.values.length === 0) return '';

  const total = series.values.reduce((a, b) => a + b, 0);
  const colors = el.options?.chartColors ?? ['#0F766E', '#0284C7', '#C88A1E', '#52666A'];

  let chartSvg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#FFFFFF" stroke="#B9D8D4" stroke-width="1" />`;

  if (el.options?.title) {
    chartSvg += `<text x="${x + w / 2}" y="${y + 24}" font-family="Aptos, sans-serif" font-size="16px" font-weight="bold" fill="#073B3A" text-anchor="middle">${escapeXml(el.options.title)}</text>`;
  }

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

    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

    chartSvg += `<path d="${d}" fill="${color}" stroke="#FFFFFF" stroke-width="2" />`;
    startAngle = endAngle;
  });

  // Legend
  if (el.options?.showLegend && series.labels) {
    const legendY = y + h - 35;
    const totalLabels = series.labels.length;
    const itemW = w / totalLabels;

    series.labels.forEach((label, idx) => {
      const lx = x + idx * itemW + 10;
      const color = colors[idx % colors.length];
      chartSvg += `<rect x="${lx}" y="${legendY}" width="12" height="12" rx="3" fill="${color}" />`;
      chartSvg += `<text x="${lx + 16}" y="${legendY + 10}" font-family="Aptos, sans-serif" font-size="11px" fill="#52666A">${escapeXml(label)}</text>`;
    });
  }

  return chartSvg;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
