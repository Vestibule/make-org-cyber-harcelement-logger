import { buildConversation } from '../buildConversation';

describe('buildConversation', () => {
  test('buildConversation should split conversation between receiver and sender', () => {
    // GIVEN
    const data = [
      {
        position: { left: 0.06768961995840073, top: 0.10665285587310791 },
        text: 'moment où je clique sur "Submit"',
      },
      {
        position: { left: 0.1704486608505249, top: 0.25243937969207764 },
        text: 'Ce weekend ça va être chaud',
      },
      {
        position: { left: 0.17215119302272797, top: 0.2813314199447632 },
        text: '(hackathon) je te réponds lundi au',
      },
      {
        position: { left: 0.17046934366226196, top: 0.3108881413936615 },
        text: 'plus tard !!',
      },
      {
        position: { left: 0.17068704962730408, top: 0.3526124060153961 },
        text: 'Tu pourrais carrément faire une PR',
      },
      {
        position: { left: 0.17050157487392426, top: 0.38174372911453247 },
        text: 'stp ?',
      },
      {
        position: { left: 0.06596865504980087, top: 0.43316981196403503 },
        text: "Aaah yes c'est vrai c'est le",
      },
      {
        position: { left: 0.0674496591091156, top: 0.46209457516670227 },
        text: 'hackathon!!!!!',
      },
      {
        position: { left: 0.06550727784633636, top: 0.5043306350708008 },
        text: 'Aucun soucis!',
      },
      {
        position: { left: 0.06662187725305557, top: 0.5464484095573425 },
        text: 'Bon courage :)',
      },
      {
        position: { left: 0.6344005465507507, top: 0.5978537797927856 },
        text: 'Merci !',
      },
      {
        position: { left: 0.19694702327251434, top: 0.6395748257637024 },
        text: "Tu peux m'inscrire pour le Bad stp ?",
      },
      {
        position: { left: 0.08190786838531494, top: 0.7159894108772278 },
        text: 'Vous',
      },
      {
        position: { left: 0.08342722058296204, top: 0.7393432855606079 },
        text: "Tu peux m'inscrire pour le Bad stp ?",
      },
      {
        position: { left: 0.06562552601099014, top: 0.7702677249908447 },
        text: "Ah yes j'avais pas vu que le lien était",
      },
      {
        position: { left: 0.06670582294464111, top: 0.8002142906188965 },
        text: 'posté!',
      },
      {
        position: { left: 0.06644348800182343, top: 0.8288720846176147 },
        text: "C'est fait :)",
      },
      {
        position: { left: 0.6555152535438538, top: 0.880413293838501 },
        text: 'Merci !',
      },
    ];

    // WHEN
    const result = buildConversation(data);

    // THEN
    expect(result).toMatchInlineSnapshot(`
      Object {
        "receiver": Array [
          "Ce weekend ça va être chaud",
          "(hackathon) je te réponds lundi au",
          "plus tard !!",
          "Tu pourrais carrément faire une PR",
          "stp ?",
          "Merci !",
          "Tu peux m'inscrire pour le Bad stp ?",
          "Vous",
          "Tu peux m'inscrire pour le Bad stp ?",
          "Merci !",
        ],
        "sender": Array [
          "moment où je clique sur \\"Submit\\"",
          "Aaah yes c'est vrai c'est le",
          "hackathon!!!!!",
          "Aucun soucis!",
          "Bon courage :)",
          "Ah yes j'avais pas vu que le lien était",
          "posté!",
          "C'est fait :)",
        ],
      }
    `);
  });
});
