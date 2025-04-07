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
    <Link to={to} className={`h-14 ${className}`}>
      <img className="h-full" src={src} alt="Logo" />
    </Link>
  );
}
