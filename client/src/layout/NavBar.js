import { useEffect } from "react";
import { useGetCurrentUserMutation } from "../lib/userApis";

const NavBar = () => {
  const [getCurrentUser] = useGetCurrentUserMutation();

  useEffect(() => {
    getCurrentUser();
  }, []);
  return <div></div>;
};

export default NavBar;
