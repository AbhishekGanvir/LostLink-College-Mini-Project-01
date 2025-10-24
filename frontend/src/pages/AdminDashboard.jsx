import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`);
      const data = await res.json();
      setStats(data);
    };

    const fetchUsers = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`);
      const data = await res.json();
      setUsers(data);
    };

    fetchStats();
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {stats ? (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
            <h4 className="text-gray-600 text-sm">Total Users</h4>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalUsers}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
            <h4 className="text-gray-600 text-sm">Total Posts</h4>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalPosts}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
            <h4 className="text-gray-600 text-sm">Total Comments</h4>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalComments}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">All Users</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.isAdmin ? "Admin" : "User"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
