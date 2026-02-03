import type { TranslationKey } from "./i18n";

export type TableStatus = "available" | "reserved" | "occupied";

export type TableFloor = {
  id: string;
  label: TranslationKey;
  icon: string;
  tables: { id: number; seats: number; status: TableStatus }[];
};

export const tableFloors: TableFloor[] = [
  {
    id: "ground",
    label: "groundFloor",
    icon: "GF",
    tables: [
      { id: 1, seats: 2, status: "available" },
      { id: 2, seats: 2, status: "occupied" },
      { id: 3, seats: 4, status: "available" },
      { id: 4, seats: 4, status: "reserved" },
      { id: 5, seats: 6, status: "available" },
      { id: 6, seats: 6, status: "available" },
      { id: 7, seats: 8, status: "occupied" },
      { id: 8, seats: 4, status: "available" },
    ],
  },
  {
    id: "first",
    label: "firstFloor",
    icon: "F1",
    tables: [
      { id: 9, seats: 2, status: "reserved" },
      { id: 10, seats: 4, status: "available" },
      { id: 11, seats: 6, status: "available" },
      { id: 12, seats: 8, status: "available" },
    ],
  },
];
