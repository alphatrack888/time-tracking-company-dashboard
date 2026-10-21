import { PieChart, Pie, Cell, Text, Rectangle } from "recharts";

export default function ProjectPieChart({ selectedYear }) {
  const generatedYearData = [
    {
      year: 2023,
      data: [
        { name: "Completed", value: 70 },
        { name: "Pending", value: 30 },
      ],
    },
    {
      year: 2024,
      data: [
        { name: "Completed", value: 32 },
        { name: "Pending", value: 68 },
      ],
    },
    {
      year: 2025,
      data: [
        { name: "Completed", value: 60 },
        { name: "Pending", value: 40 },
      ],
    },
  ];

  const COLORS = {
    Completed: "#3F80AE",
    Pending: "#C3D8E6",
  };

  const renderCustomLabel = ({ cx, cy, value }) => {
    const textX = cx;
    const textY = cy;

    const backgroundWidth = 90;
    const backgroundHeight = 90;

    return (
      <>
        <Rectangle
          x={textX - backgroundWidth / 2}
          y={textY - backgroundHeight / 2}
          width={backgroundWidth}
          height={backgroundHeight}
          fill="#C3D8E6"
          radius={9999}
          strokeWidth={1}
        />
        <Text
          x={textX}
          y={textY + 8}
          fill="#000"
          textAnchor="middle"
          style={{ fontWeight: "500", fontSize: 14 }}
        >
          {`${value}%`}
        </Text>
      </>
    );
  };

  const selectedYearData = generatedYearData.find(
    (data) => data.year === selectedYear
  );

  return (
    <div className="">
      <PieChart width={300} height={242} className="mx-auto">
        <Pie
          data={selectedYearData.data} // Use selected year data
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          labelLine={false}
          label={renderCustomLabel}
          stroke="none"
        >
          {selectedYearData.data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name]} // Fill based on name
            />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
