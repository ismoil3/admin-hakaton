import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/layout";
import TeamPage from "./pages/teams";
import LoginPage from "./pages/login";
import TeamDetailPage from "./pages/detail-team";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/teams",
          element: <TeamPage />,
        },
        {
          path: "/teams/:id",
          element: <TeamDetailPage />,
        },
        {
          path: "/",
          element: <TeamPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    }
  ]);
  return <RouterProvider router={router} />;
};

export default App;
