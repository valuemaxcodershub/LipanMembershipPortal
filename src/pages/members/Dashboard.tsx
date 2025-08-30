import { Card, Button, Badge, Table } from "flowbite-react";
import {
  FiUpload,
  FiBookOpen,
  FiFileText,
  FiCreditCard,
  FiUsers,
  FiCalendar,
  FiBell,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";
import { PageMeta } from "../../utils/app/pageMetaValues";
import axios from "../../config/axios";
import { useEffect, useState } from "react";
import { Skeleton } from "../../components/UI/Skeleton";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth";
import { formatDate } from "../../utils/app/time";
import {
  checkProfileCompletion,
  ProfileCheckResult,
} from "../../utils/app/profile";


function MemberDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [profileCompletion, setProfileCompletion] =
    useState<ProfileCheckResult | null>(null);

 

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statResponse, profileResponse] = await Promise.all([
        axios.get("/user/stats/"),
        // axios.get("/events/me/?type=upcoming"),
        axios.get("/auth/user/"),
      ]);
      const profileRes = profileResponse.data;
      const completion = checkProfileCompletion(profileRes, [
        "id",
        "created_at",
        "updated_at",
        "is_active",
        "is_admin",
        "is_staff",
        "membership_type",
        "membership_detail",
        "payment_status",
        "plan_type",
        "profile_pic",
        "bio",
      ]);
      setProfileCompletion(completion);
      setDashboard(statResponse.data);
      setLoading(false);
    } catch (err) {
      setDashboard(null);
      // Optionally show error UI
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Card className="space-y-6">
        {/* Welcome Section Skeleton */}
        <Skeleton className="h-32 w-full" />
        {/* Stats Section Skeleton */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        {/* Membership & Notifications Skeleton */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        {/* Upcoming Events Skeleton */}
        <Skeleton className="h-40 w-full" />
        {/* Quick Actions Skeleton */}
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  return (
    <>
      <PageMeta>
        <title>Member Dashboard | LIPAN</title>
        <meta
          name="description"
          content="Access your dashboard to view recent activities, stats, and quick actions."
        />
      </PageMeta>
      
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="p-6 shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome Back {user?.first_name} {user?.last_name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {dashboard?.subscription?.membership_type
              ? `You are a ${dashboard.subscription.membership_type} member (${dashboard.subscription.plan_type} plan).`
              : "Upgrade your membership for unlimited access and exclusive features."}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xl mt-1">
            LiPAN membership ID: <span className="text-blue-600 font-bold">{user?.lipan_id || "N/A"}</span>
          </p>
          <Button
            gradientDuoTone="purpleToBlue"
            className="mt-4"
            as={Link}
            to={"/member/my-membership"}
          >
            Manage Membership
          </Button>
        </Card>

        {profileCompletion && (
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
              {profileCompletion.isComplete ? (
                <>
                  <FiCheckCircle className="text-green-500" />
                  Profile Complete
                </>
              ) : (
                <>
                  <FiAlertCircle className="text-yellow-500" />
                  Complete Your Profile
                </>
              )}
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${profileCompletion.completionPercentage}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {profileCompletion.completionPercentage}% complete
            </p>

            {/* Badges for Incomplete Fields */}
            {!profileCompletion.isComplete && (
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Incomplete Fields:
                </p>
                <div className="flex flex-wrap gap-2">
                  {profileCompletion.incompleteFields.map((field, idx) => (
                    <Badge key={idx} color="failure">
                      {field
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              color="blue"
              className="mt-6"
              as={Link}
              to="/member/profile"
            >
              Update Profile
            </Button>
          </Card>
        )}

        {/* Stats Section */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FiBookOpen}
            color="blue"
            title="Approved Resources"
            value={dashboard?.resources?.approved ?? 0}
          />
          <StatCard
            icon={FiFileText}
            color="purple"
            title="Pending Resources"
            value={dashboard?.resources?.pending ?? 0}
          />
          <StatCard
            icon={FiAlertCircle}
            color="red"
            title="Rejected Resources"
            value={dashboard?.resources?.rejected ?? 0}
          />
          <StatCard
            icon={FiCreditCard}
            color="green"
            title="Total Resources"
            value={dashboard?.resources?.total ?? 0}
          />
        </div>

        {/* Membership & Notifications */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
          <StatCard
            icon={FiUsers}
            color="indigo"
            title="Membership Type"
            value={dashboard?.subscription?.membership_type ?? "-"}
          />
          <StatCard
            icon={FiClock}
            color="yellow"
            title="Membership Ends"
            value={formatDate(dashboard?.subscription?.end_date) ?? "-"}
          />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
          <StatCard
            icon={FiBell}
            color="pink"
            title="Unread Notifications"
            value={dashboard?.notifications?.unread ?? 0}
          />
          <StatCard
            icon={FiBell}
            color="gray"
            title="Total Notifications"
            value={dashboard?.notifications?.total ?? 0}
          />
        </div>

        {/* Upcoming Events */}
        {/* <Card className="p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Upcoming Events
          </h2>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="text-gray-800 dark:text-gray-200">
                Event
              </Table.HeadCell>
              <Table.HeadCell className="text-gray-800 dark:text-gray-200">
                Date
              </Table.HeadCell>
              <Table.HeadCell className="text-gray-800 dark:text-gray-200">
                Location
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {events.map((evnt: any, index: number) => (
                <Table.Row
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Table.Cell className="text-gray-800 dark:text-gray-200">
                    {evnt.title}
                  </Table.Cell>
                  <Table.Cell className="text-gray-800 dark:text-gray-200">
                    <FiCalendar className="inline text-blue-500 mr-2" />{" "}
                    {formatDate(evnt.date)}
                  </Table.Cell>
                  <Table.Cell className="text-gray-800 dark:text-gray-200">
                    {evnt.location}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card> */}

        {/* Quick Actions */}
        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ActionButton
              to="/member/my-journal"
              icon={FiUpload}
              color="blue"
              text="Upload a Journal"
            />
            <ActionButton
              to="/member/my-resources"
              icon={FiBookOpen}
              color="green"
              text="Explore Resources"
            />
          </div>
        </Card>
      </div>
    </>
  );
}

// StatCard now supports value as ReactNode for skeleton
const StatCard = ({
  icon: Icon,
  color,
  title,
  value,
}: {
  icon: any;
  color: string;
  title: string;
  value: React.ReactNode;
}) => (
  <Card>
    <div className="flex items-center space-x-4">
      <div className={`rounded-lg bg-${color}-100 dark:bg-${color}-900 p-4`}>
        <Icon
          className={`text-${color}-600 dark:text-${color}-400`}
          size={28}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  </Card>
);

const ActionButton = ({ icon: Icon, color, text, to }: Record<string, any>) => (
  <Button
    color={color}
    as={Link}
    to={to}
    className="flex items-center space-x-2 w-full"
  >
    <Icon size={20} />
    <span className="text-gray-800 dark:text-gray-100">{text}</span>
  </Button>
);

export default MemberDashboard;
