export const sports = {
  basketball: "basketball",
  volleyball: "volleyball",
} as const;

export type Sport = (typeof sports)[keyof typeof sports];
