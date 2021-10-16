import {
  convertTextractOutputToLinesWithPosition,
  extractTextFromDocument,
} from './textractClient';
import { analyzeMessages } from '../bodyguardService/analyzeMessages';
import fs from 'fs';
import { saveScreenshot } from './saveScreenshot';

const analyzeScreenshot = async (file: Buffer) => {
  const data = await extractTextFromDocument(file);
  const linesWithPosition = convertTextractOutputToLinesWithPosition(data);
  // TODO: improve lines extractions
  const analyzedLines = await analyzeMessages(
    linesWithPosition.map((line) => line.text),
  );
  if (analyzedLines.some((line) => line.classification === 'HATEFUL')) {
    console.log('Screenshot WAS considered as inappropriate.');
    await saveScreenshot(file);
    return;
  }
  console.log('Screenshot WAS NOT considered as inappropriate.');
  return;
};

export const handler = async () => {
  const testFile = fs.readFileSync(
    './src/screenshotService/assets/whatsapp.jpeg',
  );
  try {
    await analyzeScreenshot(testFile);
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
};

handler();
