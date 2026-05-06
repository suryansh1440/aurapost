import React from "react";

const BarChart = ({ data, color }) => {
  return (
    <div className="mini-chart">
      {data.map((val, i) => (
        <div
          key={i}
          className="bar"
          style={{ height: `${val}%`, background: color }}
        />
      ))}
    </div>
  );
};

export default BarChart;
