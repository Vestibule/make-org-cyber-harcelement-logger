import {
  BlockType,
  DetectDocumentTextCommand,
  DetectDocumentTextCommandInput, DetectDocumentTextCommandOutput,
  TextractClient,
} from '@aws-sdk/client-textract';
import fs from 'fs';
import { LineWithPosition } from './splitConversation';

export const textractClient = new TextractClient({});

export const extractTextFromDocument = async () => {
  const testFile = fs.readFileSync(
    './src/screenshotService/assets/whatsapp.jpeg',
  );
  const textractInput: DetectDocumentTextCommandInput = {
    Document: {
      Bytes: testFile,
    },
  };
  const command = new DetectDocumentTextCommand(textractInput);
  return textractClient.send(command);
};

export const convertTextractOutputToLinesWithPosition = (
  data: DetectDocumentTextCommandOutput,
): LineWithPosition[] => {
  return data.Blocks.filter(
    (block) => block.BlockType === BlockType.LINE && block.Geometry.BoundingBox,
  ).map((block) => ({
    position: {
      left: block.Geometry.BoundingBox?.Left,
      top: block.Geometry.BoundingBox?.Top,
    },
    text: block.Text,
  }));
};
