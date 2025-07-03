import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const LoadingSpinner = ({ size = "md", className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn(
        "border-2 border-white/20 border-t-white rounded-full animate-spin",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-white/70 text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;