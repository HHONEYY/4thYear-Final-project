import React from "react";
import "../styles/ChartCard.css"; 

const ChartCard = ({ title, children }) => {
  return (
    <div className="chart-card-components">
      <h3 className="chart-title">{title}</h3>
      {children}
    </div>
  );
};

export default ChartCard;
