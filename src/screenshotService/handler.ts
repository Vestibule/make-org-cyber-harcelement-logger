import * as fs from 'fs';
import {
  AnalyzeDocumentCommand,
  AnalyzeDocumentCommandInput,
  BlockType,
  TextractClient,
  DetectDocumentTextCommand,
  DetectDocumentTextCommandInput,
} from '@aws-sdk/client-textract';
import {
  convertTextractOutputToLinesWithPosition,
  extractTextFromDocument,
  textractClient,
} from './textractClient';
import { LineWithPosition, splitConversation } from './splitConversation';

export const handler = async () => {
  try {
    const data = await extractTextFromDocument();
    const linesWithPosition = convertTextractOutputToLinesWithPosition(data);
    const conversation = splitConversation(linesWithPosition);
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
};

handler();
