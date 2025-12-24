import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Point = {
  month: string;
  sales?: number;
  products?: number;
  orders?: number;
};

interface Props {
  data?: Point[]; // [{month: "2025-01", sales: 123, products: 45, orders: 67}, ...]
}

const   DashboardChart = ({ data = [] }: Props) => {
  return (
    <div className="w-full h-[70vh] bg-white p-4 rounded shadow">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#4ad991"
            strokeWidth={2}
            dot={true}
          />
          <Line
            type="monotone"
            dataKey="products"
            stroke="#ffc849"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#ff9870"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
