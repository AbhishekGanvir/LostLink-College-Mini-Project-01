import React, { useState, useEffect } from "react";
import { getAllUsers } from "../utils/api";

const RightPanel = () => {
  const [length, setLength] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setLength(data.length);
      } catch (error) {
        return;
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-3">About Us</h3>
        <img
          src="https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?q=80&w=1974&auto=format"
          alt="About"
          className="rounded-lg mb-4 w-full h-32 object-cover"
        />
        <p className="text-sm text-gray-600 leading-relaxed">
          Welcome to our Lost & Found community! We're dedicated to helping
          students reconnect with their lost belongings and celebrate acts of
          honesty and kindness.
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Community Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">1,234</p>
            <p className="text-xs text-gray-500">Items Found</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{length}</p>
            <p className="text-xs text-gray-500">Active Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
