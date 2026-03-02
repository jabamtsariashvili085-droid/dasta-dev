import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainItems = [
  { title: "მთავარი", url: "/dashboard", icon: LayoutDashboard },
  { title: "POS / სალარო", url: "/pos", icon: ShoppingCart },
];

const warehouseItems = [
  { title: "პროდუქტები", url: "/dashboard/products", icon: Package },
  { title: "საწყობი", url: "/dashboard/warehouse", icon: Warehouse },
];

const managementItems = [
  { title: "მომხმარებლები", url: "/dashboard/users", icon: Users },
  { title: "დოკუმენტები", url: "/dashboard/documents", icon: FileText },
  { title: "ანალიტიკა", url: "/dashboard/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <Warehouse className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-bold text-sidebar-accent-foreground text-sm">WareFlow</p>
              <p className="text-xs text-sidebar-muted">Enterprise POS</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-muted text-xs uppercase tracking-wider">მენიუ</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Warehouse */}
        <SidebarGroup>
          <Collapsible defaultOpen>
            {!collapsed && (
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 text-xs uppercase tracking-wider text-sidebar-muted hover:text-sidebar-foreground">
                საწყობი
                <ChevronDown className="w-3 h-3" />
              </CollapsibleTrigger>
            )}
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {warehouseItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                          <item.icon className="w-4 h-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <Collapsible defaultOpen>
            {!collapsed && (
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 text-xs uppercase tracking-wider text-sidebar-muted hover:text-sidebar-foreground">
                მართვა
                <ChevronDown className="w-3 h-3" />
              </CollapsibleTrigger>
            )}
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {managementItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                          <item.icon className="w-4 h-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/dashboard/settings" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                <Settings className="w-4 h-4" />
                {!collapsed && <span>პარამეტრები</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/" activeClassName="">
                <LogOut className="w-4 h-4" />
                {!collapsed && <span>გასვლა</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
