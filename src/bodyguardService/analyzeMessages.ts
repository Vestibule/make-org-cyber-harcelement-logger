import { mockBodyguardClient } from './mockBodyguardClient';

export type Classification = 'HATEFUL' | 'NEUTRAL' | 'SUPPORTIVE';

export type ClassificationWithText = {
  text: string;
  classification: Classification;
};

export const analyzeMessages = async (
  messages: string[],
): Promise<ClassificationWithText[]> => {
  return mockBodyguardClient(messages);
};
