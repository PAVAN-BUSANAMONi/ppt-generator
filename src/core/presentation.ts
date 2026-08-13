/**
 * Presentation engine — thin wrapper over PptxGenJS.
 * Pure, deterministic: data in → PPTX out.
 */

import PptxGenJS from 'pptxgenjs';
import * as path from 'path';
import * as fs from 'fs';
import {
  PresentationDefinition,
  SlideDefinition,
  SlideElement,
  TextElement,
  ShapeElement,
  ImageElement,
  TableElement,
  ChartElement,
  DEFAULT_CANVAS,
  CanvasSize,
} from './types';

// ---------------------------------------------------------------------------
// createPresentation
// ---------------------------------------------------------------------------

export function createPresentation(
  title: string,
  options?: { author?: string; canvas?: CanvasSize }
): PresentationDefinition {
  return {
    title,
    author: options?.author,
    canvas: options?.canvas ?? DEFAULT_CANVAS,
    slides: [],
  };
}

// ---------------------------------------------------------------------------
// addSlide
// ---------------------------------------------------------------------------

export function addSlide(
  pres: PresentationDefinition,
  slide: SlideDefinition
): PresentationDefinition {
  return {
    ...pres,
    slides: [...pres.slides, slide],
  };
}

// ---------------------------------------------------------------------------
// exportPresentation  —  renders the definition to an actual .pptx file
// ---------------------------------------------------------------------------

export async function exportPresentation(
  pres: PresentationDefinition,
  outputPath: string
): Promise<string> {
  const pptx = new PptxGenJS();

  // -- Canvas setup --
  pptx.defineLayout({
    name: 'CUSTOM',
    width: pres.canvas.width,
    height: pres.canvas.height,
  });
  pptx.layout = 'CUSTOM';
  pptx.title = pres.title;
  if (pres.author) pptx.author = pres.author;

  // -- Render each slide --
  for (const slideDef of pres.slides) {
    const slide = pptx.addSlide();

    if (slideDef.background) {
      slide.background = { color: slideDef.background };
    }

    if (slideDef.notes) {
      slide.addNotes(slideDef.notes);
    }

    for (const el of slideDef.elements) {
      renderElement(slide, el);
    }
  }

  // -- Ensure output directory exists --
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // -- Write file --
  await pptx.writeFile({ fileName: outputPath });

  return outputPath;
}

// ---------------------------------------------------------------------------
// Element renderers
// ---------------------------------------------------------------------------

function renderElement(
  slide: PptxGenJS.Slide,
  element: SlideElement
): void {
  switch (element.kind) {
    case 'text':
      renderText(slide, element);
      break;
    case 'shape':
      renderShape(slide, element);
      break;
    case 'image':
      renderImage(slide, element);
      break;
    case 'table':
      renderTable(slide, element);
      break;
    case 'chart':
      renderChart(slide, element);
      break;
  }
}

function renderText(slide: PptxGenJS.Slide, el: TextElement): void {
  const textOptions: PptxGenJS.TextPropsOptions = {
    x: el.position.x,
    y: el.position.y,
    w: el.size.w,
    h: el.size.h,
    fontFace: el.style.fontFace ?? 'Aptos',
    fontSize: el.style.fontSize ?? 18,
    color: el.style.color ?? '073B3A',
    bold: el.style.bold ?? false,
    italic: el.style.italic ?? false,
    align: el.style.align ?? 'left',
    valign: el.style.valign ?? 'top',
    fill: el.boxFill ? { color: el.boxFill } : undefined,
    line: el.boxStroke ? { color: el.boxStroke, width: 1 } : undefined,
  };

  if (el.style.bullet) {
    if (typeof el.style.bullet === 'boolean') {
      textOptions.bullet = true;
    } else {
      textOptions.bullet = { characterCode: el.style.bullet.code ?? '2022' };
    }
  }

  if (el.style.margin) {
    textOptions.margin = el.style.margin;
  }

  if (typeof el.content === 'string') {
    slide.addText(el.content, textOptions);
  } else {
    // Array of text runs
    const runs: PptxGenJS.TextProps[] = el.content.map((run) => ({
      text: run.text,
      options: {
        fontFace: run.options?.fontFace ?? el.style.fontFace ?? 'Aptos',
        fontSize: run.options?.fontSize ?? el.style.fontSize ?? 18,
        color: run.options?.color ?? el.style.color ?? '073B3A',
        bold: run.options?.bold ?? el.style.bold ?? false,
        italic: run.options?.italic ?? el.style.italic ?? false,
        bullet: run.options?.bullet
          ? typeof run.options.bullet === 'boolean'
            ? true
            : { characterCode: run.options.bullet.code ?? '2022' }
          : undefined,
      },
    }));
    slide.addText(runs, textOptions);
  }
}

function renderShape(slide: PptxGenJS.Slide, el: ShapeElement): void {
  const shapeMap: Record<string, PptxGenJS.ShapeType> = {
    'rect': 'rect' as PptxGenJS.ShapeType,
    'rounded-rect': 'roundRect' as PptxGenJS.ShapeType,
    'line': 'line' as PptxGenJS.ShapeType,
    'ellipse': 'ellipse' as PptxGenJS.ShapeType,
  };

  const shapeOptions: PptxGenJS.ShapeProps = {
    x: el.position.x,
    y: el.position.y,
    w: el.size.w,
    h: el.size.h,
    fill: el.fill ? { color: el.fill } : undefined,
    line: el.stroke ? { color: el.stroke, width: el.strokeWidth ?? 1 } : undefined,
    rectRadius: el.rectRadius,
  };

  if (el.shadow && el.shadow.type !== 'none') {
    shapeOptions.shadow = {
      type: el.shadow.type,
      blur: el.shadow.blur,
      offset: el.shadow.offset,
      color: el.shadow.color,
      opacity: el.shadow.opacity,
    };
  }

  slide.addShape(shapeMap[el.shapeType] ?? ('rect' as PptxGenJS.ShapeType), shapeOptions);
}

function renderImage(slide: PptxGenJS.Slide, el: ImageElement): void {
  const imgProps: PptxGenJS.ImageProps = {
    x: el.position.x,
    y: el.position.y,
    w: el.size.w,
    h: el.size.h,
  };

  if (el.path) imgProps.path = el.path;
  if (el.data) imgProps.data = el.data;

  if (el.sizing) {
    imgProps.sizing = {
      type: el.sizing.type ?? 'cover',
      w: el.size.w,
      h: el.size.h,
      x: el.sizing.x,
      y: el.sizing.y,
    };
  }

  slide.addImage(imgProps);
}

function renderTable(slide: PptxGenJS.Slide, el: TableElement): void {
  const rows: PptxGenJS.TableRow[] = el.rows.map((row) =>
    row.map((cell) => ({
      text: cell.text,
      options: {
        fontFace: cell.options?.fontFace ?? 'Aptos',
        fontSize: cell.options?.fontSize ?? 14,
        color: cell.options?.color ?? '073B3A',
        bold: cell.options?.bold ?? false,
        fill: cell.options?.fill ? { color: cell.options.fill } : undefined,
        align: cell.options?.align ?? 'left',
        valign: cell.options?.valign ?? 'middle',
        colspan: cell.options?.colSpan,
        rowspan: cell.options?.rowSpan,
      },
    }))
  );

  const tableOptions: PptxGenJS.TableProps = {
    x: el.position.x,
    y: el.position.y,
    w: el.size.w,
    h: el.size.h,
    colW: el.colWidths,
    border: el.border ? { color: el.border.color ?? 'B9D8D4', pt: el.border.pt ?? 1 } : undefined,
  };

  slide.addTable(rows, tableOptions);
}

function renderChart(slide: PptxGenJS.Slide, el: ChartElement): void {
  const chartTypeMap: Record<string, any> = {
    'doughnut': 'doughnut',
    'pie': 'pie',
    'bar': 'bar',
    'line': 'line',
    'col': 'col',
  };

  const chartOpts: PptxGenJS.IChartOpts = {
    x: el.position.x,
    y: el.position.y,
    w: el.size.w,
    h: el.size.h,
    showLegend: el.options?.showLegend ?? true,
    legendPos: el.options?.legendPos ?? 'b',
    showTitle: el.options?.showTitle ?? false,
    title: el.options?.title,
    chartColors: el.options?.chartColors,
  };

  slide.addChart(chartTypeMap[el.chartType] ?? 'doughnut', el.data, chartOpts);
}
