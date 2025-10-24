import React from "react";

const Sidebar = ({
  selectedFilter,
  onFilterChange,
  category,
  onCategoryChange,
}) => {
  const filters = [
    { label: "All Items", value: "all" },
    { label: "Lost Items", value: "lost" },
    { label: "Found Items", value: "found" },
  ];

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Personal Items", value: "personal item" },
    { label: "Documents", value: "documents" },
  ];

  return (
    <div className="w-64 bg-white shadow-sm p-5 rounded-lg space-y-6 h-fit sticky top-24">
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Filter by Type</h3>
        <div className="space-y-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`block w-full text-left px-3 py-2 rounded-md transition ${
                selectedFilter === f.value
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Filter by Category</h3>
        <div className="space-y-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => onCategoryChange(c.value)}
              className={`block w-full text-left px-3 py-2 rounded-md transition ${
                category === c.value
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
