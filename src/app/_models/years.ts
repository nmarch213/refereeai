export const bookYears = {
  "2024-25": "2024-25",
} as const;

export type BookYear = (typeof bookYears)[keyof typeof bookYears];
