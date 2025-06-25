import NavBar from "./NavBar/NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <NavBar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
