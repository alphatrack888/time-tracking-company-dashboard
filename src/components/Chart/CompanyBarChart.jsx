import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CompanyBarChart({ selectedYear, companyMonthData }) {
  const year = companyMonthData?.year;

  const dataForChart = selectedYear === year ? companyMonthData?.data : [];

  if (dataForChart.length === 0) {
    return (
      <p className="text-yellow-600">No data available for the selected year</p>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={dataForChart}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={(month) => month.slice(0, 3)} />
          <YAxis />
          <Tooltip
            formatter={(value) => new Intl.NumberFormat().format(value)}
            labelFormatter={(label) => `Month: ${label}`}
          />
          {/* <Legend /> */}
          <Bar dataKey="count" fill="#3F80AE" barSize={20} />
          {/* <Bar dataKey="users" fill="#5856D6" barSize={20} /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
