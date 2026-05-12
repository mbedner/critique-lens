import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/30 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:   "bg-primary text-primary-foreground shadow-sm hover:bg-primary/85 hover:shadow-md",
        outline:   "border-border bg-background text-foreground hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost:     "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "h-9 gap-1.5 px-4 text-sm",
        xs:      "h-7 gap-1 px-2.5 text-xs",
        sm:      "h-8 gap-1.5 px-3 text-sm",
        lg:      "h-10 gap-2 px-5 text-[13px]",
        xl:      "h-11 gap-2 px-6 text-sm",
        icon:    "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkButtonVariants> {
  href: string;
}

export function LinkButton({ href, variant, size, className, children, ...props }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(linkButtonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}
