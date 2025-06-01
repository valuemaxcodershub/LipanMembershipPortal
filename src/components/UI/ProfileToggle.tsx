import { Avatar, Dropdown } from "flowbite-react";
import { useAuth } from "../../hooks/auth";
import { getInitails } from "../../utils/app/text";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function ProfileToggle() {
  const { user, logout } = useAuth();
  return (
    <Dropdown
      label={
        <Avatar
          img={
            user?.profile_pic
              ? `${import.meta.env.VITE_API_URL + user?.profile_pic}`
              : undefined
          }
          placeholderInitials={getInitails(user?.full_name || "")}
          color={"purple"}
          rounded
        />
      }
      arrowIcon={false}
      inline
      className="!min-w-[200px]"
    >
      <Dropdown.Header>
        <span className="block text-sm">{user?.full_name}</span>
        <span className="block truncate text-sm font-medium">
          {user?.email}
        </span>
      </Dropdown.Header>
      {user?.is_admin ? (
        <>
          <Dropdown.Item as={Link} to="/admin/dashboard">
            Admin Dashboard
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/admin/manage-users">
            Manage Users
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/admin/manage-journals">
            Manage Resources
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/admin/portal-settings">
            Portal Settings
          </Dropdown.Item>
        </>
      ) : (
        <>
          <Dropdown.Item as={Link} to="/member/dashboard">
            Dashboard
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/member/my-journal">
            My Journals
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/member/profile">
            Profile Settings
          </Dropdown.Item>
        </>
      )}
      <Dropdown.Divider />
      <Dropdown.Item>
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 text-white bg-[#ff0000] rounded-md"
        >
          <FiLogOut className="mr-3" size={20} /> Logout
        </button>
      </Dropdown.Item>
    </Dropdown>
  );
}

export default ProfileToggle;
