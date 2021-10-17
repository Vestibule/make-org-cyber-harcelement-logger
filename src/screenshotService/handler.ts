import {
  convertTextractOutputToMessagesWithPosition,
  extractTextFromDocument,
} from './conversation/textractClient';
import { buildConversation } from './conversation/buildConversation';
import { cleanMessages } from './conversation/cleanMessages';
import { fromBuffer } from 'file-type';

const analyzeScreenshot = async (file: Buffer) => {
  const data = await extractTextFromDocument(file);
  const messagesWithPosition = convertTextractOutputToMessagesWithPosition(
    data,
  );
  // TODO: improve lines extractions
  const conversation = buildConversation(cleanMessages(messagesWithPosition));
  console.log(conversation);
  // const analyzedLines = await analyzeMessages(conversation.sender);
  // if (analyzedLines.some((line) => line.classification === 'HATEFUL')) {
  //   console.log('Screenshot WAS considered as inappropriate.');
  //   // TODO: implement saveScreenshot
  //   await saveScreenshot(file);
  //   return;
  // }
  // console.log('Screenshot WAS NOT considered as inappropriate.');
  // return;
};

export const handler = async (screenshot: string) => {
  console.log('HAHAAHAH');
  console.log(screenshot);
  const file = Buffer.from(screenshot, 'base64');
  console.log(file);
  try {
    await analyzeScreenshot(file);
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
};
