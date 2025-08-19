import { Navbar, Button } from "flowbite-react";
import { FaBookReader } from "react-icons/fa";
import { Logo } from "./Logo";

const NavigationBar = () => {
  return (
    <Navbar
      fluid
      rounded
      className="bg-black text-white px-4 py-2 shadow-md w-full rounded-2xl"
    >
      {/* Logo + Title */}
      <Navbar.Brand href="/">
        <Logo src="/logo-light.png" className="h-9 lg:h-14" />
      </Navbar.Brand>

      {/* Toggle for Mobile */}
      <Navbar.Toggle />

      {/* Links */}
      <Navbar.Collapse>
        <Navbar.Link
          href="https://lipanonline.org/"
          target="_blank"
          className="text-white hover:text-blue-400"
        >
          Home
        </Navbar.Link>
        <Navbar.Link
          href="https://lipanonline.org/about-us/"
          target="_blank"
          className="text-white hover:text-blue-400"
        >
          About Us
        </Navbar.Link>
        <Navbar.Link
          href="https://lipanonline.org/conferences"
          target="_blank"
          className="text-white hover:text-blue-400"
        >
          Conferences
        </Navbar.Link>
        <Navbar.Link
          href="https://lipanonline.org/publications"
          target="_blank"
          className="text-white hover:text-blue-400"
        >
          Publications
        </Navbar.Link>
        <Navbar.Link
          href="https://lipanonline.org/events"
          target="_blank"
          className="text-white hover:text-blue-400"
        >
          Event
        </Navbar.Link>
        {/* <Navbar.Link
          href="/login"
          className="text-white font-bold hover:text-blue-400"
        >
          LOGIN
        </Navbar.Link> */}
        <Navbar.Link
          href="https://lipanonline.org/blog"
          target="_blank"
          className="text-white hover:text-blue-400"
        >
          Blog
        </Navbar.Link>
        <Navbar.Link
          href="https://lipanonline.org/contact-us"
          target="_blank"
          className="text-white hover:text-blue-400"
        >
          Contact
        </Navbar.Link>
        <div className="block md:hidden ml-4">
          <Button
            gradientDuoTone="purpleToBlue"
            className="rounded-full w-full"
          >
            Donate
          </Button>
        </div>
      </Navbar.Collapse>

      {/* Donate Button */}
      <div className="hidden md:block ml-4">
        <Button gradientDuoTone="purpleToBlue" className="rounded-full">
          Donate
        </Button>
      </div>
    </Navbar>
  );
};

export default NavigationBar;
