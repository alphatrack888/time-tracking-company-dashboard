import { PieChart, Pie, Cell, Text, Rectangle } from "recharts";
import { convertMillisecondsToHHMMSS } from "../../utils/TimeConverter";

export default function EmployeeBreakPieChart({ breakHours, totalHours }) {
  const totalBreakTime = convertMillisecondsToHHMMSS(breakHours);
  // const totalWorkingTime = convertMillisecondsToHHMMSS(workingHours);
  // const totalDuration = convertMillisecondsToHHMMSS(totalHours);

  const workingTime = totalHours - breakHours;
  // console.log("xxxx", workingTime);

  const data = [
    { name: "Working Time", value: workingTime },
    { name: "Non-Working Time", value: breakHours },
  ];

  const COLORS = {
    "Working Time": "#3F80AE", // blue
    "Non-Working Time": "#D9D9D9", //gray
  };

  // const convertToHMS = (minutes) => {
  //   const hours = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   const seconds = 0;
  //   return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
  //     2,
  //     "0"
  //   )}:${String(seconds).padStart(2, "0")}`;
  // };

  // const formattedBreakTime = convertToHMS(todaysBreakTime);

  const renderCustomLabel = ({ cx, cy }) => {
    const textX = cx;
    const textY = cy;

    const backgroundWidth = 40;
    const backgroundHeight = 40;

    return (
      <>
        <Rectangle
          x={textX - backgroundWidth / 2}
          y={textY - backgroundHeight / 2}
          width={backgroundWidth}
          height={backgroundHeight}
          fill="#fff"
          radius={9999}
        />
        <Text
          x={textX}
          y={textY + 5}
          fill="#333333"
          textAnchor="middle"
          style={{ fontWeight: "bold", fontSize: 16 }}
        >
          {totalBreakTime}
        </Text>
      </>
    );
  };

  return (
    <div className="">
      <PieChart width={250} height={180} className="mx-auto">
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          labelLine={false}
          label={renderCustomLabel}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
