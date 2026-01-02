import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../theme-provider";
import { ModeToggle } from "../mode-toggle";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // delete token
    navigate("/login", { replace: true });   // redirect
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Toaster position="bottom-right" reverseOrder={false} />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="dark:bg-slate-950">
          <header className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <ModeToggle />
            </div>

            {/* LOGOUT BUTTON */}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="curso"
            >
              Logout
            </Button>
          </header>

          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
