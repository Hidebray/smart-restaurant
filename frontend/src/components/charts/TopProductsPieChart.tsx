import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export default function TopProductsPieChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" label />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
