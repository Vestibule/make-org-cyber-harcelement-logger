export type MessageWithPosition = {
  text: string;
  position: { left: number; top: number };
};

export type Conversation = {
  sender: string[];
  receiver: string[];
};