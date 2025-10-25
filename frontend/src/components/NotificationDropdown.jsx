import React, { useEffect, useState } from "react";
import { getNotifications, deleteNotification } from "../utils/api";
import { Trash2 } from "lucide-react";
import Loader from "./Loader";

const NotificationPanel = ({ userId, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getNotifications(userId);
      setNotifications(data);
      setLoading(false);
    }
    if (userId) loadData();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setDeleting(null);
    } catch {
      setDeleting(null);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-2xl cursor-pointer rounded-lg border border-gray-100 z-30">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 text-xs font-medium"
        >
          Close
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-6">
            No notifications yet.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className="flex justify-between items-start p-3 bg-gray-50 hover:bg-gray-100 rounded-md mb-2 transition"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{n.message}</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(n._id)}
                disabled={deleting === n._id}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                {deleting === n._id ? (
                  <Loader size={14} />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
