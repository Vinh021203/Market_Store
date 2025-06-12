import React from "react";
import {
  Code,
  Palette,
  Zap,
  Globe,
  Smartphone,
  Database,
  Cloud,
  Shield,
} from "lucide-react";

export const TechStack = () => {
  const techIcons = [
    { Icon: Code, name: "Development", color: "text-blue-500" },
    { Icon: Palette, name: "Design", color: "text-purple-500" },
    { Icon: Zap, name: "Performance", color: "text-yellow-500" },
    { Icon: Globe, name: "Web", color: "text-green-500" },
    { Icon: Smartphone, name: "Mobile", color: "text-pink-500" },
    { Icon: Database, name: "Database", color: "text-indigo-500" },
    { Icon: Cloud, name: "Cloud", color: "text-cyan-500" },
    { Icon: Shield, name: "Security", color: "text-red-500" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 py-8">
      {techIcons.map(({ Icon, name, color }, index) => (
        <div
          key={name}
          className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group animate-in fade-in duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div
            className={`p-3 rounded-full bg-background shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200 ${color}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
};

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export const GradientBlob = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`absolute rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl animate-pulse ${className}`}
    />
  );
};

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <GradientBlob className="top-10 left-10 w-72 h-72" />
      <GradientBlob className="bottom-10 right-10 w-96 h-96" />
      <GradientBlob className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64" />
      <FloatingElements />
    </div>
  );
};
