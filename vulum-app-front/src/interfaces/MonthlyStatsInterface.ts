export interface MonthlyStatItem {
  month:  number;
  monthName: string;
  sales: number;
  products: number;
  pendings:  number;
}

export type MonthlyStatsInterface = MonthlyStatItem[];