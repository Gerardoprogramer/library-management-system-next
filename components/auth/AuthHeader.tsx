import { Gem } from "lucide-react";
import Link from "next/link";

interface AuthHeaderProps {
  subtitle: string;
}

export const AuthHeader = (props: AuthHeaderProps) => {
  return (
      <div className="flex flex-col items-center mb-10">
        <Link href="/"
          className="w-14 h-14 bg-foreground flex items-center justify-center rotate-45 mb-4 cursor-pointer"
        >
          <Gem className="w-7 h-7 text-background -rotate-45" strokeWidth={1.5} />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-foreground tracking-wider uppercase">
          Obsidian Library
        </h1>
        <p className="font-body text-muted-foreground mt-1">
          {props.subtitle}
        </p>
      </div>
  )
}
