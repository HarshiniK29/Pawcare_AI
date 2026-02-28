import { Heart, Home, AlertCircle, Map, Stethoscope, PawPrint } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Disease Detection", url: "/disease-detection", icon: Stethoscope },
  { title: "NGO Locator", url: "/ngo-locator", icon: Map },
  { title: "Case Tracker", url: "/cases", icon: AlertCircle },
  { title: "Adoption Portal", url: "/adoption", icon: Heart },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="bg-[hsl(var(--sidebar-background))] border-r-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))]">
      <SidebarHeader className="p-4 pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary-foreground text-primary p-2 rounded-xl">
            <PawPrint className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">PawCare AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50 text-xs font-semibold uppercase tracking-wider mt-4 mb-2">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link 
                        href={item.url} 
                        className={`flex items-center gap-3 py-6 transition-all ${
                          isActive 
                            ? "bg-white/10 text-white font-medium" 
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : ""}`} />
                        <span className="text-[15px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
