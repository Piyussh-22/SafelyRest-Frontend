import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Users, Home, UserCheck, UserCircle, CalendarDays } from "lucide-react";
import { fetchAdminStats } from "../../store/adminSlice.js";
import { PageSpinner } from "../../components/ui/Spinner.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { ROUTES } from "../../constants/index.js";

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div
    className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--bg)] p-5 flex items-center gap-4 shadow-sm`}
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-[var(--text)]">{value ?? "—"}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading) return <PageSpinner message="Loading dashboard…" />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  const { totalMembers, totalHosts, totalGuests, totalHouses, recentUsers } =
    stats ?? {};

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Platform overview and recent activity.
            </p>
          </div>
          <Link
            to={ROUTES.ADMIN_BOOKINGS}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
          >
            <CalendarDays size={15} />
            All bookings
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total members"
            value={totalMembers}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            label="Total hosts"
            value={totalHosts}
            icon={UserCheck}
            color="bg-green-500"
          />
          <StatCard
            label="Total guests"
            value={totalGuests}
            icon={UserCircle}
            color="bg-amber-500"
          />
          <StatCard
            label="Total houses"
            value={totalHouses}
            icon={Home}
            color="bg-purple-500"
          />
        </div>

        {/* Recent users table */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--bg)] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-[var(--text)]">Recent Users</h2>
          </div>

          {!recentUsers?.length ? (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">
              No users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-6 py-3 font-medium text-[var(--text)]">
                        {u.firstName}
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant={u.userType}>{u.userType}</Badge>
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
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
    </div>
  );
};

export default AdminDashboard;
