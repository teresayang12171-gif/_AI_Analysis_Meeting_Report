export interface GenerateSettings {
  outputStyle: 'detailed' | 'concise' | 'bulletPoints' | 'actionItems';
  targetLanguage: 'zh-TW' | 'en' | 'ja' | 'ko';
  tone: 'professional' | 'friendly' | 'structured';
}

export interface GenerateRequest {
  transcript: string;
  settings: GenerateSettings;
}

export interface GenerateResponse {
  success: boolean;
  text?: string;
  error?: string;
  stats?: {
    originalWords: number;
    generatedWords: number;
    estimatedCharacters: number;
  };
}
