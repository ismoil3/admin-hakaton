import { ChevronRight, MailCheck, Users } from "lucide-react";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Link } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Platform",
      items: [
        {
          title: "Teams",
          url: "/teams",
          icon: Users,
        },
        {
          title: "SMS logs",
          url: "/sms-logs",
          icon: MailCheck,
        },
        {
          title: "Send SMS",
          url: "/send-sms",
          icon: MailCheck,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border/50">
        <Link to="/" className="flex items-center gap-2 font-semibold">
           {/* Ensure logo looks good on dark/light by possibly inverting colors via CSS if needed,
               or just use the image as is if it has a transparent bg */}
          <img src="/logo-removebg-preview.png" className="h-10 w-auto object-contain" alt="Logo" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item: any) => (
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
                            {item.subItems.map((subItem: any) => (
                              <SidebarMenuItem key={subItem.title}>
                                <SidebarMenuButton asChild size="sm">
                                  <Link
                                    to={subItem.url}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link to={item.url}>
                          {item.icon && <item.icon className="size-4 opacity-70 group-hover/menu-item:opacity-100" />}
                          <span className="font-medium">{item.title}</span>
                        </Link>
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
