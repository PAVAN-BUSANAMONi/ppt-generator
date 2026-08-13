# ppt-generator

Deterministic PPTX rendering engine.

**JSON/data → TypeScript → PptxGenJS → valid PPTX**

No AI. No research. No RAG. No Next.js. No database.

## Quick start

```bash
npm install
npm run build       # TypeScript type-check
npm run test-deck   # Generate test PPTX → outputs/
```

## Canvas

- 1280 × 720 (16:9)
- 13.333″ × 7.5″

## API

```ts
import { createPresentation, addSlide, exportPresentation } from './core/presentation';

let pres = createPresentation('My Deck');
pres = addSlide(pres, slideDefinition);
await exportPresentation(pres, 'outputs/my-deck.pptx');
```

## Structure

```
src/
├── core/          # Types + presentation engine
├── design/        # (future) design tokens & themes
├── components/    # (future) reusable slide components
├── slides/        # (future) slide templates
├── renderer/      # (future) advanced rendering
└── export/        # (future) export utilities
```
