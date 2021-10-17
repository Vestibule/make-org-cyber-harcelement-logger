import {
  convertTextractOutputToMessagesWithPosition,
  extractTextFromDocument,
} from './conversation/textractClient';
import { analyzeMessages } from '../bodyguardService/analyzeMessages';
import * as fs from 'fs';
import { saveScreenshot } from './saveScreenshot';
import { buildConversation } from './conversation/buildConversation';
import { cleanMessages } from './conversation/cleanMessages';

const analyzeScreenshot = async (file: string) => {
  const data = await extractTextFromDocument(Buffer.from(file, 'binary'));
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
  console.log(typeof screenshot);

  try {
    await analyzeScreenshot(screenshot);
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
};
