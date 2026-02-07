import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#8F0177] text-white hover:bg-[#6A0156] shadow-md hover:shadow-lg active:scale-95",
        destructive: "bg-[#DE1A58] text-white hover:bg-[#B91547] shadow-md active:scale-95",
        outline: "border-2 border-[#8F0177] text-[#8F0177] bg-white hover:bg-[#8F0177]/10 active:scale-95",
        secondary: "bg-[#360185] text-white hover:bg-[#240154] shadow-md active:scale-95",
        ghost: "hover:bg-[#F4B342]/10 hover:text-[#F4B342]",
        link: "text-[#8F0177] underline-offset-4 hover:underline",
        gradient: "bg-[#8F0177] text-white shadow-lg hover:shadow-xl hover:bg-[#6A0156] active:scale-95",
        accent: "bg-[#F4B342] text-[#360185] shadow-lg hover:shadow-xl hover:bg-[#E6A432] active:scale-95",
        hero: "bg-[#8F0177] text-white shadow-xl hover:shadow-2xl hover:bg-[#6A0156] text-base px-8 py-6 active:scale-95",
        "hero-outline": "border-2 border-[#8F0177] bg-white text-[#8F0177] hover:bg-[#8F0177] hover:text-white text-base px-8 py-6 active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
