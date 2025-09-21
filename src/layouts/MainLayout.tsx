import { Button, Navbar, DarkThemeToggle, Footer} from "flowbite-react";
import { Link, Outlet } from "react-router-dom";
import { Logo } from "../components/UI/Logo";
import { useAuth } from "../hooks/auth";
import ProfileToggle from "../components/UI/ProfileToggle";

function MainLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <Navbar fluid className="sticky top-0 z-50 !bg-blue-700 lg:!px-24">
        <div className="h-9 lg:h-14">
          <Logo className="w-full h-full" />
        </div>
        <div className="flex md:order-2 ml-5">
          <Navbar.Toggle className="text-white hover:bg-transparent" />
          <DarkThemeToggle />
        </div>
        <Navbar.Collapse className="ms-auto">
          {!isAuthenticated ? (
            <>
              <Button
                as={Link}
                to="/auth/sign-in"
                size="sm"
                color="blue"
                outline
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/auth/sign-up"
                size="sm"
                color="blue"
                outline
              >
                Get Started
              </Button>
            </>
          ) : (
            <ProfileToggle />
          )}
        </Navbar.Collapse>
      </Navbar>

      <Outlet />

      {/* Footer */}
      <Footer container>
        <div className="w-full text-center">
          <Footer.Divider />
          <div className="w-full flex justify-between items-center">
            <Logo className="bg-blue-700 rounded-md sm:rounded-xl p-1 !h-[2rem] sm:!h-14" />
            <Footer.Copyright
              href="#"
              by="LiPAN™"
              year={new Date().getFullYear()}
            />
          </div>
        </div>
      </Footer>
    </div>
  );
}

export default MainLayout;
