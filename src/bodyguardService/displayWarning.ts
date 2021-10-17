import { ClassificationWithText } from './analyzeMessages';
import { capitalize } from 'lodash';

export const displayWarning = (
  analyzedLines: ClassificationWithText[],
  fileType: 'notification' | 'screenshot',
) => {
  const inappropriateMessages = analyzedLines.filter(
    (line) => line.classification === 'HATEFUL',
  );
  if (inappropriateMessages.length) {
    console.log(
      `🚨 ${capitalize(fileType)} WAS considered as inappropriate! 🚨`,
    );
    console.log(
      'Inappropriate messages were: ',
      inappropriateMessages.map((message) => message.text),
    );
    return;
  }
  console.log(
    `✅ ${capitalize(fileType)} WAS NOT considered as inappropriate. ✅`,
  );
  return;
};
