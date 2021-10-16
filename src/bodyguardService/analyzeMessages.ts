import { bodyguardClient } from './bodyguardClient';

export type Classification = 'HATEFUL' | 'NEUTRAL' | 'SUPPORTIVE';

export type ClassificationWithText = {
  text: string;
  classification: Classification;
};

export const analyzeMessages = async (
  messages: string[],
): Promise<ClassificationWithText[]> => {
  return bodyguardClient(messages);
};
