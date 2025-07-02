
import { Sidebar } from "@/components/layout/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar className="w-64 epic-sidebar" />
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
