import { Button, Card, Navbar, Footer, DarkThemeToggle } from "flowbite-react";
import { FiArrowRight, FiLogIn, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Logo } from "../../components/UI/Logo";

function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <Navbar fluid className="sticky top-0 z-50 !bg-blue-700 lg:!px-24">
        <Navbar.Brand>
          <Logo className="h-9 lg:h-14" />
        </Navbar.Brand>
        <div className="flex md:order-2 ml-5">
          <Navbar.Toggle className="text-white hover:bg-transparent" />
          <DarkThemeToggle />
        </div>
        <Navbar.Collapse className="ms-auto">
          <Button as={Link} to="/auth/sign-in" size="sm" color="blue" outline>
            Login
          </Button>
          <Button as={Link} to="/auth/sign-up" size="sm" color="blue" outline>
            Get Started
          </Button>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero Section */}
      <div className="flex flex-col items-center bg-gradient-to-r from-blue-300 via-white to-gray-100 dark:from-blue-900 dark:via-gray-800 dark:to-gray-900 px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold leading-tight text-gray-800 dark:text-white md:text-5xl">
          Welcome to the{" "}
          <span className="text-blue-700 dark:text-blue-400">
            LiPAN Members Portal
          </span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          LIPAN (formerly RAN) is an affiliate of the International Literacy
          Association (ILA), with headquarters in Newark, Delaware, USA.
          Established in 1984, we are dedicated to empowering Nigerians with the
          knowledge and skills for sustainable development.
        </p>
        <div className="mt-8 flex space-x-4">
          <Button
            as={Link}
            to="/auth/sign-up"
            color="blue"
            size="lg"
            className="flex items-center space-x-2"
          >
            Get Started
            <FiArrowRight className="ml-3 h-6" />
          </Button>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Our Mission
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600 dark:text-gray-300">
            To empower Nigerians with appropriate knowledge, attitudes, and
            skills through reading, in order to effectively harness our human
            and natural resources for the sustainable development of Nigeria.
          </p>
        </div>
      </div>

      {/* About LIPAN Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Who We Are
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="dark:bg-gray-900 dark:border-gray-700">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <FiUsers size={24} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
                National Representation
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                We are a national chapter affiliated with the International
                Literacy Association (ILA) and a proud member of the
                International Development Committee for Africa (IDC-Africa).
              </p>
            </Card>
            <Card className="dark:bg-gray-900 dark:border-gray-700">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                <FiUsers size={24} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
                Pan-African Focus
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                As part of the Pan-African umbrella of ILA, we aim to foster
                literacy and sustainable development across Nigeria and beyond.
              </p>
            </Card>
            <Card className="dark:bg-gray-900 dark:border-gray-700">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                <FiUsers size={24} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
                Empowering Nigerians
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Through our programs and initiatives, we strive to equip
                Nigerians with literacy skills to achieve personal and national
                growth.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-700 py-16 text-center text-white dark:bg-blue-800">
        <h2 className="text-3xl font-bold">
          Join the LiPAN Members Portal Today
        </h2>
        <p className="mt-4 text-lg">
          Explore exclusive member resources, collaborate with peers, and make a
          difference in literacy development.
        </p>
        <div className="mt-8 flex justify-center space-x-4"></div>
      </div>

      {/* Footer */}
      <Footer container>
        <div className="w-full text-center">
          <Footer.Divider />
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <Logo className="bg-blue-700 rounded-xl p-1" />
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

export default WelcomePage;
