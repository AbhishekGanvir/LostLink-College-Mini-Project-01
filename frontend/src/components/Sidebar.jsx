import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ selectedFilter, onFilterChange, category, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filters = [
    { label: "All Items", value: "all" },
    { label: "Lost Items", value: "LOST" },
    { label: "Found Items", value: "FOUND" },
  ];

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Personal Items", value: "personal item" },
    { label: "Documents", value: "document" },
  ];

  const handleSelect = (filter) => {
    onFilterChange(filter.value);
    setIsOpen(false);
  };

  const selectedFilterLabel = filters.find(f => f.value === selectedFilter)?.label || "All Items";

  return (
    <div className="space-y-6 ">
    <div className="bg-white p-5 rounded-xl shadow-sm sticky hidden lg:block ">
      {/* Dropdown for Filter by Type */}
      <div className="relative ">
        <h3 className="font-bold cursor-pointer mb-7">Sort by Type</h3>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md focus:outline-none"
        >
          <span>{selectedFilterLabel}</span>
          <ChevronDown className="w-4 h-4 cursor-pointer text-gray-500" />
        </button>

        {isOpen && (
          <ul className="absolute mt-1 w-full bg-white mb-4 border-1 cursor-pointer rounded-2xl  border-white radius-3  shadow-md z-10">
            {filters.map((f) => (
              <li
                key={f.value}
                onClick={() => handleSelect(f)}
                className="px-4 py-2 hover:text-white rounded-2xl hover:bg-blue-600 cursor-pointer"
              >
                {f.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Category filter stays as buttons */}
      <div className="bg-white p-5 rounded-xl mt-5 shadow-sm">
        <h3 className="font-bold  text-lg mb-4">Quick Filters</h3>
        <div className="space-y-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => onCategoryChange(c.value)}
              className={`block w-full text-left px-3 py-2 rounded-md cursor-pointer transition ${
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
    </div>
  );
};

export default Sidebar;
