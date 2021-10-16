import { Classification } from './analyzeText';

export const mockBodyguardClient = async (
  text: string,
): Promise<{ type: Classification }> => {
  console.log('Mock processing of ', text);
  return { type: 'HATEFUL' };
};
