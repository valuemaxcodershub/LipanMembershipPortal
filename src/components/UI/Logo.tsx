import { Link } from "react-router-dom";

interface LogoPropTypes {
  className?: string;
  src?: string;
  to?: string;
}

export function Logo({
  className = "",
  src = "/main-logo.png",
  to="/",
}: LogoPropTypes) {
  return (
    <Link to={to} className={`inline-flex h-14 items-center ${className}`}>
      <img
        className="h-full w-auto max-w-full object-contain"
        src={src}
        alt="Logo"
      />
    </Link>
  );
}
