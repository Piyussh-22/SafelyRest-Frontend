import { useEffect, useState } from "react";
import api, { setAuthToken } from "../../services/api.js";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      console.log("Dashboard fetch start");
      try {
        const token = localStorage.getItem("token");
        setAuthToken(token);
        const res = await api.get("/admin/stats");
        if (res.data.success) {
          setDashboardData(res.data.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Error fetching dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6 text-lg">Loading dashboard...</p>;
  if (error)
    return (
      <p className="p-6 text-red-500 text-center text-lg font-semibold">
        {error}
      </p>
    );
  if (!dashboardData)
    return <p className="p-6 text-center text-lg">No data found</p>;

  const { totalMembers, totalHosts, totalGuests, totalHouses, recentUsers } =
    dashboardData;

  return (
    <div
      className="p-6 transition-colors duration-300"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="rounded-xl p-5 shadow-md border border-gray-200 bg-blue-300 dark:bg-blue-700 transition-colors duration-300">
          <h2 className="font-semibold">Total Members</h2>
          <p className="text-2xl font-bold mt-2">{totalMembers}</p>
        </div>

        <div className="rounded-xl p-5 shadow-md border border-gray-200 bg-green-300 dark:bg-green-700 transition-colors duration-300">
          <h2 className="font-semibold">Total Hosts</h2>
          <p className="text-2xl font-bold mt-2">{totalHosts}</p>
        </div>

        <div className="rounded-xl p-5 shadow-md border border-gray-200 bg-yellow-300 dark:bg-yellow-700 transition-colors duration-300">
          <h2 className="font-semibold">Total Guests</h2>
          <p className="text-2xl font-bold mt-2">{totalGuests}</p>
        </div>

        <div className="rounded-xl p-5 shadow-md border border-gray-200 bg-red-300 dark:bg-red-700 transition-colors duration-300">
          <h2 className="font-semibold">Total Houses</h2>
          <p className="text-2xl font-bold mt-2">{totalHouses}</p>
        </div>
      </div>

      {/* Recent Users */}
      <div className="rounded-xl p-6 shadow-md border border-gray-200 transition-colors duration-300">
        <h2 className="text-2xl font-semibold mb-4">Recent Users</h2>

        {recentUsers.length === 0 ? (
          <p className="text-gray-500 text-center">No recent users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 border-b border-gray-300 dark:border-gray-600 text-left font-semibold">
                    Name
                  </th>
                  <th className="p-3 border-b border-gray-300 dark:border-gray-600 text-left font-semibold">
                    Type
                  </th>
                  <th className="p-3 border-b border-gray-300 dark:border-gray-600 text-left font-semibold">
                    Joined On
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, index) => (
                  <tr
                    key={u._id}
                    className={`transition-colors ${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-gray-100 dark:bg-gray-900"
                    } hover:bg-gray-200 dark:hover:bg-gray-700`}
                  >
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">
                      {u.firstName}
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.userType === "host"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {u.userType.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">
                      {new Date(u.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
