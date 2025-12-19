import * as React from "react";
import {
  ChevronRight,
  // LayoutDashboard,
  // Route,
  // Database,
  Settings,
} from "lucide-react";

import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Platform",
      items: [
        // {
        //   title: "Building Application",
        //   url: "#",
        //   icon: LayoutDashboard,
        //   isActive: true,
        //   subItems: [
        //     { title: "Routing", url: "#", icon: Route },
        //     { title: "Data Fetching", url: "#", icon: Database },
        //   ],
        // },
        {
          title: "Dashboard",
          url: "#",
          icon: Settings,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="pt-4">
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground/70">
              {group.title}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item:any) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {item.subItems ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon className="size-4" />}
                            <span className="font-medium">{item.title}</span>
                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenu className="ml-4 border-l border-sidebar-border mt-1 gap-1 px-2">
                            {item.subItems.map((subItem:any) => (
                              <SidebarMenuItem key={subItem.title}>
                                <SidebarMenuButton asChild size="sm">
                                  <a
                                    href={subItem.url}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.url}>
                          {item.icon && <item.icon className="size-4" />}
                          <span className="font-medium">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
