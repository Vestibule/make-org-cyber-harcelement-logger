import { convertTextractOutputToMessagesWithPosition, extractTextFromDocument } from './conversation/textractClient';
import { buildConversation } from './conversation/buildConversation';
import { cleanMessages } from './conversation/cleanMessages';
import { analyzeMessages } from '../bodyguardService/analyzeMessages';
import { displayWarning } from '../bodyguardService/displayWarning';

const analyzeScreenshot = async (file: Buffer) => {
  console.log('Analysis start');
  const data = await extractTextFromDocument(file);
  console.log('Extracted phrases');
  const messagesWithPosition = convertTextractOutputToMessagesWithPosition(
    data,
  );

  const conversation = buildConversation(cleanMessages(messagesWithPosition));
  console.log('Extracted conversation: ', conversation);
  const analyzedLines = await analyzeMessages(conversation.sender);
  return displayWarning(analyzedLines);
};

export const handleScreenshot = async (screenshot: string) => {
  console.log('Start.');
  const file = Buffer.from(screenshot, 'base64');
  console.log('Buffer created');
  try {
    await analyzeScreenshot(file);
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
};
