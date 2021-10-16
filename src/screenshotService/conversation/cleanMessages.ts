import { MessageWithPosition } from '../types';

const WORDS_TO_FILTER = ['Aa', "Aujourd'hui", 'Message'];

const hourRegexp = new RegExp(/^\d\d\:\d\d$/);

export const cleanMessages = (messagesWithPosition: MessageWithPosition[]) => {
  const cleanedMessages = messagesWithPosition.filter((message) => {
    if (WORDS_TO_FILTER.includes(message.text.trim())) {
      return false;
    }
    if (hourRegexp.test(message.text.trim())) {
      return false;
    }
    if ([1, 2].includes(message.text.length)) {
      return false;
    }
    return true;
  });
  return cleanedMessages;
};
