import { ClassificationWithText } from './analyzeMessages';

const BAD_WORDS = ['connard', 'salaud', 'suicid', 'fdp'];

const classifyMessage = (message: string) => {
  if (BAD_WORDS.some((badWord) => message.includes(badWord))) {
    return 'HATEFUL';
  }
  return 'NEUTRAL';
};

export const mockBodyguardClient = async (
  messages: string[],
): Promise<ClassificationWithText[]> => {
  return messages.map((message) => ({
    text: message,
    classification: classifyMessage(message),
  }));
};
