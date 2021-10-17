import {
  convertTextractOutputToMessagesWithPosition,
  extractTextFromDocument,
} from './conversation/textractClient';
import { buildConversation } from './conversation/buildConversation';
import { cleanMessages } from './conversation/cleanMessages';
import { analyzeMessages } from '../bodyguardService/analyzeMessages';
import { saveScreenshot } from './saveScreenshot';

const analyzeScreenshot = async (file: Buffer) => {
  const data = await extractTextFromDocument(file);
  const messagesWithPosition = convertTextractOutputToMessagesWithPosition(
    data,
  );

  const conversation = buildConversation(cleanMessages(messagesWithPosition));
  console.log('Extracted conversation: ', conversation);
  const analyzedLines = await analyzeMessages(conversation.sender);
  const inappropriateMessage = analyzedLines.find(
    (line) => line.classification === 'HATEFUL',
  );
  if (inappropriateMessage) {
    console.log('Screenshot WAS considered as inappropriate.');
    console.log('Inappropriate message is: ', inappropriateMessage.text);
    // TODO: implement saveScreenshot
    await saveScreenshot(file);
    return;
  }
  console.log('Screenshot WAS NOT considered as inappropriate.');
  return;
};

export const handler = async (screenshot: string) => {
  const file = Buffer.from(screenshot, 'base64');
  try {
    await analyzeScreenshot(file);
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
};
