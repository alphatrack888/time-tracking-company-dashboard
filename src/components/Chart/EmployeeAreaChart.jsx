import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EmployeeAreaChart({ employeeMonthData }) {
  console.log("Revenue chart data:", employeeMonthData);

  // Get the data for the selected year from the revenueByYear object
  const selectedYearData = employeeMonthData?.data;

  return (
    <ResponsiveContainer width="100%" height={275}>
      <AreaChart
        data={selectedYearData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="30%" stopColor="#3F80AE" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#2AA0D7" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tickFormatter={(month) => month.slice(0, 3)} />
        <YAxis />
        <Tooltip
          formatter={(value) => new Intl.NumberFormat().format(value)}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#3F80AE"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
