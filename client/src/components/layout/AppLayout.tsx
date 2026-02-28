import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { PawPrint } from "lucide-react";

export function AppLayout({ children }: { children: ReactNode }) {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex min-h-screen w-full bg-background font-sans">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b bg-card shrink-0 z-10 shadow-sm shadow-black/5">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-primary hover:text-primary/80 hover:bg-primary/5 transition-colors" />
            </div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                 <PawPrint className="w-4 h-4" />
               </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto w-full relative">
            <div className="max-w-7xl mx-auto w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
