import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../auth/api";
import { RootState } from "../app/store"; // Adjust path to your store
import {
  setDashboardData,
  setLoading,
  setError,
} from "../features/dashboard/statsSlice";

const useDashboardData = () => {
  const dispatch = useDispatch();
  const { stats, monthlyStats, loading, error } = useSelector(
    (state: RootState) => state.stats
  );

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      // Skip if data already loaded
      if (stats !== null) return;

      try {
        dispatch(setLoading(true));

        const [statsRes, monthlyRes] = await Promise.all([
          api.get("/users/dashboard-stats"),
          api.get("/users/get-monthly-stats"),
        ]);

        if (!cancelled) {
          dispatch(
            setDashboardData({
              stats: statsRes.data,
              monthlyStats: monthlyRes.data,
            })
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching dashboard data:", err);
          dispatch(setError("Failed to fetch dashboard data"));
        }
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [dispatch, stats]);

  const refetch = async () => {
    dispatch(setLoading(true));
    try {
      const [statsRes, monthlyRes] = await Promise.all([
        api.get("/users/dashboard-stats"),
        api.get("/users/get-monthly-stats"),
      ]);
      dispatch(
        setDashboardData({
          stats: statsRes.data,
          monthlyStats: monthlyRes.data,
        })
      );
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      dispatch(setError("Failed to fetch dashboard data"));
    }
  };

  return { stats, monthlyStats, loading, error, refetch };
};

export default useDashboardData;
