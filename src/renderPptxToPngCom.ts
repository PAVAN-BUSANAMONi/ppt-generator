/**
 * Native PowerPoint COM Export for all 30 slides across the 3 decks
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';

function renderAllPptxSlidesToPng(pptxPath: string, outputDir: string, baseName: string, count: number): string[] {
  const absPptx = path.resolve(pptxPath);
  const absOutDir = path.resolve(outputDir);
  if (!fs.existsSync(absOutDir)) fs.mkdirSync(absOutDir, { recursive: true });

  const generatedPngs: string[] = [];

  const psScript = `
    $ppt = $null;
    try {
      $ppt = New-Object -ComObject PowerPoint.Application;
      $pres = $ppt.Presentations.Open('${absPptx}', 1, 0, 0);
      if ($pres -ne $null) {
        for ($i = 1; $i -le $pres.Slides.Count; $i++) {
          $numStr = $i.ToString('00');
          $pngPath = Join-Path '${absOutDir}' "slide-$numStr.png";
          $pres.Slides.Item($i).Export($pngPath, 'PNG', 1280, 720);
        }
        $pres.Close();
        Write-Output 'EXPORT_COMPLETE';
      }
    } catch {
      Write-Output ('EXPORT_ERROR: ' + $_.Exception.Message);
    } finally {
      if ($ppt -ne $null) { $ppt.Quit(); }
    }
  `;

  try {
    const res = execSync(`powershell -NoProfile -Command "${psScript}"`, { timeout: 30000, encoding: 'utf-8' }).trim();
    console.log(`PowerPoint Export [${baseName}]:`, res);
  } catch (err) {
    console.error(`PowerPoint COM error on ${baseName}:`, err);
  }

  for (let i = 1; i <= count; i++) {
    const numStr = String(i).padStart(2, '0');
    const p = path.join(absOutDir, `slide-${numStr}.png`);
    if (fs.existsSync(p)) {
      generatedPngs.push(p);
    }
  }

  return generatedPngs;
}

async function createMontage(pngPaths: string[], montagePath: string) {
  const thumbW = 400;
  const thumbH = 225;
  const cols = 5;
  const rows = 2;
  const padding = 20;

  const montageW = cols * thumbW + (cols + 1) * padding;
  const montageH = rows * thumbH + (rows + 1) * padding;

  const compositeInputs = [];

  for (let i = 0; i < pngPaths.length; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;

    const left = padding + c * (thumbW + padding);
    const top = padding + r * (thumbH + padding);

    const resizedPng = await sharp(pngPaths[i])
      .resize(thumbW, thumbH)
      .toBuffer();

    compositeInputs.push({
      input: resizedPng,
      left,
      top,
    });
  }

  await sharp({
    create: {
      width: montageW,
      height: montageH,
      channels: 4,
      background: { r: 5, g: 47, b: 53, alpha: 1 },
    },
  })
    .composite(compositeInputs)
    .webp({ quality: 90 })
    .toFile(montagePath);
}

async function runNativeRenders() {
  console.log('Rendering 30 native PowerPoint slides via COM...');
  const rendersBaseDir = path.resolve(__dirname, '..', 'work', 'renders');

  // 1. Reference
  const refPptx = path.resolve(__dirname, '..', 'outputs', 'reference-10-slide.pptx');
  const refDir = path.join(rendersBaseDir, 'reference');
  const refPngs = renderAllPptxSlidesToPng(refPptx, refDir, 'Reference', 10);
  await createMontage(refPngs, path.join(refDir, 'deck-montage.webp'));
  console.log(`✔ Reference Deck: ${refPngs.length}/10 slides rendered via PowerPoint COM`);

  // 2. Climate
  const climatePptx = path.resolve(__dirname, '..', 'outputs', 'climate-10-slide.pptx');
  const climateDir = path.join(rendersBaseDir, 'climate');
  const climatePngs = renderAllPptxSlidesToPng(climatePptx, climateDir, 'Climate', 10);
  await createMontage(climatePngs, path.join(climateDir, 'deck-montage.webp'));
  console.log(`✔ Climate Deck: ${climatePngs.length}/10 slides rendered via PowerPoint COM`);

  // 3. AI Healthcare
  const healthPptx = path.resolve(__dirname, '..', 'outputs', 'ai-healthcare-10-slide.pptx');
  const healthDir = path.join(rendersBaseDir, 'ai-healthcare');
  const healthPngs = renderAllPptxSlidesToPng(healthPptx, healthDir, 'AI Healthcare', 10);
  await createMontage(healthPngs, path.join(healthDir, 'deck-montage.webp'));
  console.log(`✔ AI Healthcare Deck: ${healthPngs.length}/10 slides rendered via PowerPoint COM`);
}

runNativeRenders().catch(console.error);
