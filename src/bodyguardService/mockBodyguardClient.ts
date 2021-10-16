import { ClassificationWithText } from './analyzeMessages';

export const mockBodyguardClient = async (
  messages: string[],
): Promise<ClassificationWithText[]> => {
  return messages.map((message) => ({
    text: message,
    classification: 'HATEFUL',
  }));
};
