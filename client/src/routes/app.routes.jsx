import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import ResumeBuilder from "../pages/ResumeBuilder";
import Preview from "../pages/Preview";
import AppLayout from "../layouts/AppLayout";
import Login from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <AppLayout />,
    path: "app",
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "builder/:resumeId",
        element: <ResumeBuilder />,
      },
    ],
  },
  {
    path: "view/:resumeId",
    element: <Preview />,
  },
]);
