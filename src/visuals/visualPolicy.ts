/**
 * Step 11 — Visual Policy Matrix
 *
 * Rules-based visual policy mapping slide archetype, topic, title, and data intents to VisualPlan.
 */

import { VisualPlan, VisualType, VisualPlacement, VisualAspectRatio } from './visualTypes';

export function determineVisualPolicy(
  slide: any,
  presentationTopic: string
): VisualPlan {
  const slideType = (slide.type || 'concept').toLowerCase();
  const title = (slide.title || '').toLowerCase();
  const topic = presentationTopic.toLowerCase();

  let type: VisualType = 'mixed';
  let purpose = `Visual representation supporting ${slide.title}`;
  let placement: VisualPlacement = 'right';
  let aspectRatio: VisualAspectRatio = 'landscape';
  let relevanceQuery: string | undefined = `${presentationTopic} ${slide.title}`;

  // 1. Statistics & Metrics -> Prefer Chart
  if (slideType === 'statistics' || title.includes('metric') || title.includes('index') || title.includes('statistics')) {
    type = 'chart';
    purpose = 'Quantitative data visualization displaying empirical metrics and statistical distribution.';
    placement = 'left';
    aspectRatio = 'landscape';
    relevanceQuery = `${presentationTopic} data chart metrics`;
  }
  // 2. Process & Workflow -> Prefer Process / Diagram
  else if (slideType === 'process' || title.includes('workflow') || title.includes('pipeline') || title.includes('treatment')) {
    type = 'process';
    purpose = 'Sequential process diagram illustrating multi-stage operational workflow.';
    placement = 'right';
    aspectRatio = 'landscape';
    relevanceQuery = `${presentationTopic} process diagram`;
  }
  // 3. Comparison -> Prefer Comparison Graphic / Table
  else if (slideType === 'comparison' || title.includes('versus') || title.includes(' vs ') || title.includes('comparison')) {
    type = 'comparison';
    purpose = 'Balanced dual-panel visual comparison highlighting structural distinctions.';
    placement = 'full';
    aspectRatio = 'landscape';
    relevanceQuery = `${presentationTopic} comparison breakdown`;
  }
  // 4. Data Tables -> Prefer Table
  else if (slideType === 'table' || slide.data || title.includes('standard') || title.includes('threshold')) {
    type = 'table';
    purpose = 'Structured multi-column data table presenting regulatory thresholds and parameters.';
    placement = 'left';
    aspectRatio = 'landscape';
    relevanceQuery = `${presentationTopic} standards table`;
  }
  // 5. Case Study -> Prefer Photograph + Metrics
  else if (slideType === 'case-study' || title.includes('case study') || title.includes('deployment')) {
    type = 'photo';
    purpose = 'Real-world photographic evidence demonstrating field deployment and operational results.';
    placement = 'right';
    aspectRatio = 'portrait';
    relevanceQuery = `${presentationTopic} field operation photo`;
  }
  // 6. Cause & Effect -> Prefer Diagram
  else if (slideType === 'cause-effect' || title.includes('cause') || title.includes('impact') || title.includes('feedback')) {
    type = 'diagram';
    purpose = 'Causal mechanism diagram linking drivers to systemic consequences.';
    placement = 'right';
    aspectRatio = 'landscape';
    relevanceQuery = `${presentationTopic} cause effect diagram`;
  }
  // 7. Title Slide -> Prefer Photo / Panel
  else if (slideType === 'title') {
    type = 'photo';
    purpose = 'Hero photographic background setting high-impact visual context for presentation topic.';
    placement = 'full';
    aspectRatio = 'landscape';
    relevanceQuery = `${presentationTopic} high quality photo`;
  }
  // 8. Overview -> Prefer Icon Grid
  else if (slideType === 'overview' || title.includes('agenda')) {
    type = 'icon-grid';
    purpose = 'Multi-pillar icon grid visually mapping presentation sections.';
    placement = 'right';
    aspectRatio = 'square';
    relevanceQuery = `${presentationTopic} agenda icons`;
  }
  // 9. Takeaways -> Prefer Icon Grid / Illustration
  else if (slideType === 'takeaways' || title.includes('takeaway') || title.includes('guideline')) {
    type = 'icon-grid';
    purpose = 'Structured recommendation cards with custom icon badges.';
    placement = 'right';
    aspectRatio = 'square';
    relevanceQuery = `${presentationTopic} action guidelines`;
  }
  // 10. Conclusion -> Prefer None / Hero Focus
  else if (slideType === 'conclusion' || title.includes('conclusion')) {
    type = 'none';
    purpose = 'Clean typography synthesis layout focused on final strategic call-to-action.';
    placement = 'bottom';
    aspectRatio = 'landscape';
    relevanceQuery = undefined;
  }
  // 11. Real-World Photography for Agriculture / Pollution concepts
  else if (topic.includes('agriculture') || topic.includes('pollution')) {
    type = 'photo';
    purpose = 'High-resolution photographic visual reinforcing domain context.';
    placement = 'right';
    aspectRatio = 'landscape';
    relevanceQuery = `${presentationTopic} photograph`;
  }

  return {
    type,
    purpose,
    relevanceQuery,
    placement,
    importance: slideType === 'title' || slideType === 'statistics' || slideType === 'case-study' ? 'primary' : 'supporting',
    aspectRatio,
  };
}
