
import { Sidebar } from "@/components/layout/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <Sidebar className="w-64 backdrop-blur-xl bg-blue-500/20 border-r border-blue-300/30" />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
