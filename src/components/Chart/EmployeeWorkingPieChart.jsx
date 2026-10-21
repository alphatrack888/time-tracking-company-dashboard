import { PieChart, Pie, Cell, Text, Rectangle } from "recharts";
import { formatHoursLabel } from "../../utils/TimeConverter";

export default function EmployeeWorkingPieChart({ workingHours, totalHours }) {
  const totalWorkingTime = formatHoursLabel(workingHours);
  // const totalBreakTime = convertMillisecondsToHHMMSS(breakHours);
  // const totalDuration = convertMillisecondsToHHMMSS(totalHours);

  const nonWorkingTime = totalHours - workingHours;
  // console.log("sss", nonWorkingTime);

  // console.log(totalDuration, totalBreakTime, totalWorkingTime);

  const data = [
    { name: "Working Time", value: workingHours },
    { name: "Non-Working Time", value: nonWorkingTime },
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

  // const formattedWorkingTime = convertToHMS(todaysWorkingTime);

  const renderCustomLabel = ({ cx, cy }) => {
    const textX = cx;
    const textY = cy;

    const backgroundWidth = 72;
    const backgroundHeight = 28;

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
          fill="#333"
          textAnchor="middle"
          style={{ fontWeight: "bold", fontSize: 12 }}
        >
          {totalWorkingTime}
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
