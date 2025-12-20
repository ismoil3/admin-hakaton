import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../theme-provider";
import { ModeToggle } from "../mode-toggle";
export default function Layout() {
   const token = localStorage.getItem("access_token");

   if (!token) {
     return <Navigate to="/login" replace />;
   }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Toaster position="bottom-right" reverseOrder={false} />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="dark:bg-slate-950">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
<ModeToggle/>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
