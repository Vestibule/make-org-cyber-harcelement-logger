import {
  convertTextractOutputToMessagesWithPosition,
  extractTextFromDocument,
} from './conversation/textractClient';
import { analyzeMessages } from '../bodyguardService/analyzeMessages';
import * as fs from 'fs';
import { saveScreenshot } from './saveScreenshot';
import { buildConversation } from './conversation/buildConversation';
import { cleanMessages } from './conversation/cleanMessages';

const analyzeScreenshot = async (file: Buffer) => {
  const data = await extractTextFromDocument(file);
  const messagesWithPosition =
    convertTextractOutputToMessagesWithPosition(data);
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

export const handler = async (screenshot) => {
  console.log('HAHAAHAH');
  console.log(screenshot);

  try {
    await analyzeScreenshot(screenshot.buffer);
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
};
