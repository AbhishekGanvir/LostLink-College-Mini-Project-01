import React from "react";

const StatCard = ({ title, value }) => (
  <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
    <h4 className="text-gray-600 text-sm">{title}</h4>
    <p className="text-2xl font-bold text-blue-600 mt-1">{value}</p>
  </div>
);

export default StatCard;
