import { useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Sector } from "recharts";

const COLORS = [
  '#f97316', // Orange 500
  '#3b82f6', // Blue 500
  '#10b981', // Emerald 500
  '#ec4899', // Pink 500
  '#8b5cf6', // Violet 500
  '#f59e0b', // Amber 500
  '#06b6d4', // Cyan 500
  '#6366f1', // Indigo 500
  '#84cc16', // Lime 500
  '#ef4444', // Red 500
];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-5} textAnchor="middle" fill="#374151" className="text-2xl font-bold" style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {(percent * 100).toFixed(0)}%
      </text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#9ca3af" className="text-sm">
        Revenue
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

export default function TopProductsPieChart({ data }: { data: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="font-medium">No sales data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              onMouseEnter={onPieEnter}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                padding: "12px 16px"
              }}
              itemStyle={{ color: "#374151", fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Scrollable Legend */}
      <div className="mt-4 px-2 max-h-32 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 gap-2">
          {data.map((entry, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${index === activeIndex ? 'bg-gray-50 ring-1 ring-gray-200' : 'hover:bg-gray-50'}`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className={`text-sm truncate ${index === activeIndex ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                  {entry.name}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-500 pl-2">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', compactDisplay: "short", notation: "compact" }).format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
