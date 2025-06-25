import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import "./navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const guestLinks = [
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ];

  const userLinks = [
    { to: "/", label: "Home" },
    { to: "/profile", label: "Profile" },
  ];

  const adminLinks = [{ to: "/admin-dashboard", label: "Admin" }];

  const navLinks = () => {
    if (!user) return guestLinks;
    const links = [...userLinks];
    if (user.role === "admin") links.push(...adminLinks);
    return links;
  };

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link to="/">familynk</Link>
      </div>

      <details className="navbar__toggle">
        <summary>☰</summary>
        <ul className="navbar__menu">
          {navLinks().map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
          {user && (
            <li>
              <button onClick={handleLogout} className="navbar__logout">
                Sign out
              </button>
            </li>
          )}
        </ul>
      </details>

      <ul className="navbar__menu navbar__menu--desktop">
        {navLinks().map((link) => (
          <li key={link.to}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
        {user && (
          <li>
            <button onClick={handleLogout} className="navbar__logout">
              Sign out
            </button>
          </li>
        )}
      </ul>
    </header>
  );
}
