import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary hover:bg-primary/30",
        secondary:
          "border-transparent bg-secondary/20 text-secondary hover:bg-secondary/30",
        destructive:
          "border-transparent bg-destructive/20 text-destructive hover:bg-destructive/30",
        outline:
          "border-primary/50 text-primary bg-transparent hover:bg-primary/10",
        neon:
          "border-[hsl(185_100%_50%_/_0.5)] text-[hsl(185_100%_50%)] bg-[hsl(185_100%_50%_/_0.1)] hover:bg-[hsl(185_100%_50%_/_0.2)] hover:shadow-[0_0_10px_hsl(185_100%_50%_/_0.2)]",
        success:
          "border-transparent bg-success/20 text-success hover:bg-success/30",
        warning:
          "border-transparent bg-warning/20 text-warning hover:bg-warning/30",
        glass:
          "border-white/20 bg-white/5 text-foreground backdrop-blur-sm hover:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
