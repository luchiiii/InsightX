import AppRoutes from "./AppRoutes";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <AppRoutes />
      </main>
    </>
  );
};

export default Layout;
