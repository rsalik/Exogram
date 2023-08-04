export type EBGroup = {
  name: string;
  done: boolean | undefined;
};

export const EBQuestions = [
  {
    text: "Is this an <span>eclipsing binary?</span>",
    type: "boolean",
    key: "isEB",
  },
  {
    text: "Is the <span>measured period</span> correct?",
    type: "boolean",
    key: "isPeriodCorrect",
  },
  {
    text: "Additional Comments?",
    type: "text",
    key: "comments",
  },
] as const;

export type EBDisposition = {
  isEB: boolean;
  isPeriodCorrect: boolean;
  comments: string;
};
