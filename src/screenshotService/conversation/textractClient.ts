import {
  BlockType,
  DetectDocumentTextCommand,
  DetectDocumentTextCommandInput,
  DetectDocumentTextCommandOutput,
  TextractClient,
} from '@aws-sdk/client-textract';
import { MessageWithPosition } from '../types';
import { config } from 'dotenv';
config();

export const textractClient = new TextractClient({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_KEY_ID,
  },
  region: 'eu-west-3',
});

export const extractTextFromDocument = async (file: Buffer) => {
  console.log('HAHAAHAH');
  console.log(textractClient.config.credentials());
  const textractInput: DetectDocumentTextCommandInput = {
    Document: {
      Bytes: file,
    },
  };
  const command = new DetectDocumentTextCommand(textractInput);
  return textractClient.send(command);
};

export const convertTextractOutputToMessagesWithPosition = (
  data: DetectDocumentTextCommandOutput,
): MessageWithPosition[] => {
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
