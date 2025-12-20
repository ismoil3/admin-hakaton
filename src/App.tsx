import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/layout";
import TeamDetailPage from "./pages/detail-team";
import LoginPage from "./pages/login";
import SmsMailingPage from "./pages/sms-logs";
import TeamPage from "./pages/teams";
import SendSmsPage from "./pages/send-sms";

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
        // sms-logs
        {
          path: "/sms-logs",
          element: <SmsMailingPage />,
        },
        {
          path: "/send-sms",
          element: <SendSmsPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
