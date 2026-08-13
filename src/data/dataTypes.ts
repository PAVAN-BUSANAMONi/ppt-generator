/**
 * Step 13A — Value-Level Data Provenance Types
 *
 * Defines DataPointEvidence, DataSpec, DataSeries, ChartType, and ChartPlan interfaces.
 */

export interface DataPointEvidence {
  category: string;
  value: number;
  unit?: string;
  sourceIds: string[];
  evidenceText?: string;
  evidenceLocation?: string;
}

export interface DataSeries {
  name: string;
  values: number[];
  points?: DataPointEvidence[];
}

export type StatisticKind = 'single-statistic' | 'time-series' | 'category-comparison' | 'multi-series' | 'composition';

export interface DataSpec {
  id: string;
  title: string;
  description?: string;
  unit?: string;
  statisticKind?: StatisticKind;

  categories: string[];
  series: DataSeries[];
  dataPoints?: DataPointEvidence[];

  sourceIds: string[];
  notes?: string;
}

export type ChartType =
  | 'line'
  | 'bar'
  | 'grouped-bar'
  | 'stacked-bar'
  | 'area'
  | 'scatter'
  | 'pie'
  | 'doughnut'
  | 'table';

export interface ChartPlan {
  type: ChartType;
  title: string;
  purpose: string;
  dataSpecId: string;
  sourceIds: string[];
  dataSpec: DataSpec;
}
