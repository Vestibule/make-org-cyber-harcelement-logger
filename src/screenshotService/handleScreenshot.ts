import {
  convertTextractOutputToMessagesWithPosition,
  extractTextFromDocument,
} from './conversation/textractClient';
import { buildConversation } from './conversation/buildConversation';
import { cleanMessages } from './conversation/cleanMessages';
import { analyzeMessages } from '../bodyguardService/analyzeMessages';
import { displayWarning } from '../bodyguardService/displayWarning';

const analyzeScreenshot = async (file: Buffer) => {
  console.log('Extracting conversation...');
  const data = await extractTextFromDocument(file);
  const messagesWithPosition = convertTextractOutputToMessagesWithPosition(
    data,
  );

  const conversation = buildConversation(cleanMessages(messagesWithPosition));
  console.log('Extracted conversation: ', conversation);
  const analyzedLines = await analyzeMessages(conversation.sender);
  return displayWarning(analyzedLines, 'screenshot');
};

export const handleScreenshot = async (screenshot: string) => {
  console.log('Start screenshot analysis.');
  const file = Buffer.from(screenshot, 'base64');
  try {
    await analyzeScreenshot(file);
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
};
