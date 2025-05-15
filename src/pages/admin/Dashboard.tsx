import { Card, Dropdown, Progress, Table, Tooltip } from "flowbite-react";
import {
  HiUsers,
  HiDocumentText,
  HiOutlineTrendingUp,
  HiOutlineMail,
  HiDotsVertical,
} from "react-icons/hi";
import { Button } from "flowbite-react";
import { PageMeta } from "../../utils/app/pageMetaValues";
import { useState, useEffect } from "react";
import { Skeleton } from "../../components/UI/Skeleton";
import axios from "../../config/axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    events: 0,
    resourcesUploaded: 0,
    // requestRate: 0,
    journalOverview: { active: 0, pending: 0, rejected: 0 },
  });

  const fetchStats = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get("/admin/stats/")
      console.log(data)
      setStats({
        totalUsers: data.total_users,
        events: data.total_events,
        resourcesUploaded: data.total_resources,
        // requestRate: 18,
        journalOverview: { active: data.approved_resources, pending: data.pending_resources, rejected: data.rejected_resources },
      });
      setLoading(false);
    } catch (err: any) {
      console.log(err)
    }
  }

  useEffect(() => {
    // Simulate API call
    fetchStats();
  }, []);

  return (
    <>
      <PageMeta>
        <title>Admin Dashboard | LIPAN</title>
        <meta
          name="description"
          content="Overview of administrative tasks and platform statistics."
        />
      </PageMeta>
      <div className="p-6 space-y-6">
        {loading ? (
          <>
            <Skeleton className="h-10 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-10 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
            <Skeleton className="h-10 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.totalUsers}
                    </h3>
                  </div>
                  <HiUsers className="text-4xl text-blue-500" />
                </div>
              </Card>

              <Card className="hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Events</p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.events}
                    </h3>
                  </div>
                  <HiOutlineMail className="text-4xl text-red-500" />
                </div>
              </Card>

              <Card className="hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Resources Uploaded</p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stats.resourcesUploaded}
                    </h3>
                  </div>
                  <HiDocumentText className="text-4xl text-green-500" />
                </div>
              </Card>

              {/* <Card className="hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Request Rate</p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      +{stats.requestRate}%
                    </h3>
                  </div>
                  <HiOutlineTrendingUp className="text-4xl text-purple-500" />
                </div>
              </Card> */}
            </div>

            {/* Task Overview Section */}
            <Card>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Journal Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-100 rounded-lg text-center">
                  <p className="text-green-600">Active</p>
                  <h3 className="text-2xl font-bold text-green-600">
                    {stats.journalOverview.active}
                  </h3>
                </div>
                <div className="p-4 bg-yellow-100 rounded-lg text-center">
                  <p className="text-yellow-600">Pending</p>
                  <h3 className="text-2xl font-bold text-yellow-600">
                    {stats.journalOverview.pending}
                  </h3>
                </div>
                <div className="p-4 bg-red-100 rounded-lg text-center">
                  <p className="text-red-600">Rejected</p>
                  <h3 className="text-2xl font-bold text-red-600">
                    {stats.journalOverview.rejected}
                  </h3>
                </div>
              </div>
            </Card>

            {/* Quick Actions Section */}
            <Card>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button as={Link} to="/admin/manage-users" color="blue" size="lg" className="w-full">
                  Manage Users
                </Button>
                <Button as={Link} to="/admin/manage-journals" color="green" size="lg" className="w-full">
                  Manage Resources
                </Button>
                <Button as={Link} to="/admin/user-reports" color="red" size="lg" className="w-full">
                  Resolve Requests
                </Button>
                <Button as={Link} to="/admin/portal-settings" color="yellow" size="lg" className="w-full">
                  Update Settings
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
