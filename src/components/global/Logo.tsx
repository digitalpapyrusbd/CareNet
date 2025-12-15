import { Heart } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-xl btn-neumorphic-primary flex items-center justify-center relative`}>
        <Heart className={`${iconSizes[size]} relative z-10`} />
      </div>
      {size !== "sm" && (
        <div className="flex flex-col leading-none">
          <span className="gradient-primary bg-clip-text font-bold text-lg" style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text" }}>
            CareNet
          </span>
          <span className="text-[10px] text-muted-foreground">Healthcare Platform</span>
        </div>
      )}
    </div>
  );
}
