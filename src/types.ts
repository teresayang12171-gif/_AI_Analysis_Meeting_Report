export type AIProvider = 'gemini' | 'nvidia';

export interface GenerateSettings {
  outputStyle: 'detailed' | 'concise' | 'bulletPoints' | 'actionItems';
  targetLanguage: 'zh-TW' | 'en' | 'ja' | 'ko';
  tone: 'professional' | 'friendly' | 'structured';
  provider: AIProvider;
}

export interface GenerateRequest {
  transcript: string;
  settings: GenerateSettings;
  provider: AIProvider;
}

export interface GenerateResponse {
  success: boolean;
  text?: string;
  error?: string;
  provider?: AIProvider;
  stats?: {
    originalWords: number;
    generatedWords: number;
    estimatedCharacters: number;
  };
}
