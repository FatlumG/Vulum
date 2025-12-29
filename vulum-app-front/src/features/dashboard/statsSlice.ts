import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardStatsInterface } from "../../interfaces/DashboardStatsInterface";
import { MonthlyStatsInterface } from "../../interfaces/MonthlyStatsInterface";

interface DashboardState {
  stats:  DashboardStatsInterface | null;
  monthlyStats: MonthlyStatsInterface;
  loading: boolean;
  error:  string | null;
}

const initialState: DashboardState = {
  stats: null,
  monthlyStats: [],
  loading: false,
  error:  null,
};

const statsSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStats: (state, action: PayloadAction<DashboardStatsInterface>) => {
      state.stats = action.payload;
    },
    setMonthlyStats:  (state, action:  PayloadAction<MonthlyStatsInterface>) => {
      state.monthlyStats = action.payload;
    },
    setDashboardData:  (
      state,
      action: PayloadAction<{
        stats: DashboardStatsInterface;
        monthlyStats: MonthlyStatsInterface;
      }>
    ) => {
      state.stats = action.payload. stats;
      state.monthlyStats = action.payload.monthlyStats;
      state.loading = false;
      state. error = null;
    },
    clearDashboard: (state) => {
      state. stats = null;
      state.monthlyStats = [];
      state.loading = false;
      state. error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setStats,
  setMonthlyStats,
  setDashboardData,
  clearDashboard,
} = statsSlice.actions;

export default statsSlice.reducer;