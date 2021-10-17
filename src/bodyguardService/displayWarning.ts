import { ClassificationWithText } from './analyzeMessages';

export const displayWarning = (analyzedLines: ClassificationWithText[]) => {
  const inappropriateMessages = analyzedLines.filter(
    (line) => line.classification === 'HATEFUL',
  );
  if (inappropriateMessages.length) {
    console.log('🚨 Screenshot WAS considered as inappropriate! 🚨');
    console.log(
      'Inappropriate messages were: ',
      inappropriateMessages.map((message) => message.text),
    );
    return;
  }
  console.log('✅ Screenshot WAS NOT considered as inappropriate. ✅');
  return;
};
