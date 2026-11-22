export interface DiseaseCauseInfo {
  pathogenType: string;
  rootCauses: string[];
  environmentalFactors: string;
}

export interface DiseaseCureInfo {
  immediateAction: string;
  organicRemedies: string[];
  chemicalTreatment?: string;
  preventionAndCare: string[];
}

export interface GrowthDataPoint {
  day: number;
  height: number;
}

export interface GrowthForecastSummary {
  day7Cm: number;
  day14Cm: number;
  day30Cm: number;
  day60Cm: number;
  summary?: string;
}

export interface RecommendedInputItem {
  name: string;
  subtitle: string;
  category: string;
  inputType?: 'fertilizer' | 'soil' | 'pot' | 'treatment' | 'support' | 'tool' | 'pruning';
  price?: number;
  rating?: number;
  dosage?: string;
  description: string;
}

export interface PredictionResult {
  plantName: string;
  scientificName?: string;
  confidenceScore: number;
  healthStatus: 'Healthy' | 'Warning' | 'Possible Issue' | 'Diseased' | 'Critical';
  diseaseName: string;
  severity: 'None' | 'Mild' | 'Moderate' | 'High' | 'Critical';
  estimatedHeightCm?: number;
  estimatedWidthCm?: number;
  estimatedLeafAreaCm2?: number;
  growthStage?: string;
  expectedMatureHeightCm?: number;
  daysToMaturity?: number;
  growthForecast?: GrowthForecastSummary;
  symptoms: string[];
  causes: DiseaseCauseInfo;
  cureAndTreatment: DiseaseCureInfo;
  predictionSummary?: string;
  carePlan?: {
    sunlight: string;
    water: string;
    soil: string;
    fertilizer?: string;
    diseasePrevention: string;
  };
  recommendedInputs?: RecommendedInputItem[];
  currentHeightInches?: number;
  growthData?: GrowthDataPoint[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string;
  prediction: PredictionResult;
}
