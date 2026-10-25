import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EmployeeLineChart = ({ chartData }) => {
  const series = chartData?.dailyBreakdown ?? [];

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={series}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formattedDate" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="workingHours"
            stroke="#008000"
            activeDot={{ r: 8 }}
            name="Working Time (hrs)"
          />
          <Line
            type="monotone"
            dataKey="breakHours"
            stroke="#3F80AE"
            name="Break Time (hrs)"
          />
          <Line
            type="monotone"
            dataKey="plannedHours"
            stroke="#C47B2A"
            name="Planned hours"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeLineChart;
