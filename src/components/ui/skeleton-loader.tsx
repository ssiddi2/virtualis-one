import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  variant?: "card" | "table" | "text" | "button";
}

const SkeletonLoader = ({ className, lines = 3, variant = "text" }: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className="clinical-card animate-pulse">
            <div className="p-6 space-y-4">
              <div className="h-6 bg-white/20 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/15 rounded"></div>
                <div className="h-4 bg-white/15 rounded w-5/6"></div>
                <div className="h-4 bg-white/15 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        );
      
      case "table":
        return (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/15 rounded"></div>
                <div className="h-4 bg-white/15 rounded"></div>
                <div className="h-4 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        );
      
      case "button":
        return (
          <div className="h-10 bg-white/20 rounded-lg animate-pulse"></div>
        );
      
      default:
        return (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-4 bg-white/20 rounded",
                  i === lines - 1 && "w-3/4"
                )}
              ></div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={cn("animate-fade-in", className)}>
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;