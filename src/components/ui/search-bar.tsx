"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  containerClassName?: string;
}

export function SearchBar({ onClear, containerClassName, className, value, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center w-full max-w-sm", containerClassName)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        className={cn(
          "pl-9 pr-9 transition-all duration-200 focus-visible:ring-primary/30",
          className
        )}
        {...props}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7 hover:bg-transparent text-muted-foreground hover:text-foreground"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
