import { Outlet } from "react-router";
import Nabvar from "../components/Nabvar";

const AppLayout = () => {
  return (
    <main>
      <div>
        <div>
          <Nabvar />
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AppLayout;
