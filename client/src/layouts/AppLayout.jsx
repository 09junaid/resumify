import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <main>
      <h1>App Layout</h1>
      <div>
        <div>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AppLayout;
