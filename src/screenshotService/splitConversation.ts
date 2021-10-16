export type LineWithPosition = {
  text: string;
  position: { left: number; top: number };
};

export type Conversation = {
  user1: string[];
  user2: string[];
};

export const splitConversation = (linesWithPosition: LineWithPosition[]) => {};
