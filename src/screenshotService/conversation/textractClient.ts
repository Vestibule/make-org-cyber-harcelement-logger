import {
  BlockType,
  DetectDocumentTextCommand,
  DetectDocumentTextCommandInput,
  DetectDocumentTextCommandOutput,
  TextractClient,
} from '@aws-sdk/client-textract';
import { MessageWithPosition } from '../types';

export const textractClient = new TextractClient({});

export const extractTextFromDocument = async (file: Buffer) => {
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
