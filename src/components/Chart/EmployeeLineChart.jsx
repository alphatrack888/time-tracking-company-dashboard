import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const convertMillisecondsToHours = (ms) => {
  return (ms / 3600000).toFixed(2);
};

const EmployeeLineChart = ({ chartData }) => {
  console.log("chartData", chartData);

  const formattedData = chartData?.dailyBreakdown?.map((item) => ({
    ...item,
    workingHours: convertMillisecondsToHours(item.workingHours), // Convert workingHours to hours
    breakHours: convertMillisecondsToHours(item.breakHours), // Convert breakHours to hours
  }));

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeLineChart;
