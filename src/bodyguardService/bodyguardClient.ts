import axios from 'axios';

export const BODYGUARD_URL = 'https://bamboo.bodyguard.ai/api';

export type BodyguardType = 'HATEFUL' | 'NEUTRAL' | 'SUPPORTIVE';

export type BodyguardSeverity =
  | 'VERY_HIGH'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'NONE';

export type BodyguardRecommendedAction = 'REMOVE' | 'KEEP' | 'WATCH';
export type BodyguardDirectedAt =
  | 'SINGLE_PERSON'
  | 'USER_FAMILY'
  | 'USER'
  | 'GROUP'
  | 'EVERYONE'
  | 'AUTHOR_OF_COMMENT'
  | 'NO_ONE'
  | 'HATERS';

export type BodyguardClassification =
  | 'INSULT'
  | 'THREAT'
  | 'TROLLING'
  | 'BODY_SHAMING'
  | 'RACISM'
  | 'HATRED'
  | 'HOMOPHOBIA'
  | 'SEXUAL_HARASSMENT'
  | 'MORAL_HARASSMENT'
  | 'MISOGYNY'
  | 'SUPPORTIVE'
  | 'NEUTRAL'
  | 'ADS'
  | 'USELESS'
  | 'LINK'
  | 'SCAM'
  | 'SPAM';

export type BodyguardResponse = {
  text: string;
  reference: string;
  type: BodyguardType;
  severity: BodyguardSeverity;
  recommendedAction: BodyguardRecommendedAction;
  meta: {
    directedAt: BodyguardDirectedAt;

    classifications: BodyguardClassification[];
  };
  language: 'en' | 'fr';
  analyzedAt: string; // '2021-01-14T14:19:41.873Z';
};

export const bodyguardClient = async (text: string) => {
  try {
    const result = await axios.post<BodyguardResponse>(
      BODYGUARD_URL,
      JSON.stringify({
        sourceUid: process.env.BODYGUARD_API_CHANNEL_ID,
        contents: [
          {
            text,
          },
        ],
      }),
      {
        headers: {
          'X-Api-Key': process.env.BODYGUARD_API_TOKEN,
          'Content-Type': 'application/json',
        },
      },
    );
    return result.data;
  } catch (e) {
    console.log('Error: ', e);
    throw e;
  }
};
