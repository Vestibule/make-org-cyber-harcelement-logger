import { Conversation, MessageWithPosition } from '../types';
import { splitBy } from '../../utils/splitBy';
import { first, orderBy } from 'lodash';

const SAME_PERSON_PERCENTAGE_THRESHOLD = 0.01; // relative difference length tolerance to classify two messages as one person's

const isFromSamePerson = (
  parentLeftPosition: number,
  childLeftPosition: number,
): boolean => {
  return (
    Math.abs(parentLeftPosition - childLeftPosition) <=
    SAME_PERSON_PERCENTAGE_THRESHOLD
  );
};

const leftestMessage = (
  messagesWithPosition: MessageWithPosition[],
): MessageWithPosition => {
  const leftMessage = first(
    orderBy(messagesWithPosition, (message) => message.position.left),
  );
  if (!leftMessage) {
    throw new Error('No messages');
  }
  return leftMessage;
};

export const buildConversation = (
  messagesWithPosition: MessageWithPosition[],
): Conversation | undefined => {
  if (!messagesWithPosition.length) {
    return;
  }
  const firstMessageLeftPosition = leftestMessage(messagesWithPosition).position
    .left;
  const [senderMessages, receiverMessages] = splitBy(
    messagesWithPosition,
    (message) => {
      return isFromSamePerson(firstMessageLeftPosition, message.position.left);
    },
  );
  return {
    sender: senderMessages.map((message) => message.text),
    receiver: receiverMessages.map((message) => message.text),
  };
};
