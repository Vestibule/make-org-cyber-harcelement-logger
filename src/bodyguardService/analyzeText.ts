import { bodyguardClient } from './bodyguardClient';

export type Classification = 'HATEFUL' | 'NEUTRAL' | 'SUPPORTIVE';

export const analyzeText = async (text: string): Promise<Classification> => {
  const analysisResult = await bodyguardClient(text);
  return analysisResult.type;
};
