"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const Header = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm rounded-b-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* You can place your SVG logo here */}
          <span className="text-lg font-bold">
            Scena
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {session ? (
            <Button onClick={() => signOut()} variant="outline">
              Cerrar Sesión
            </Button>
          ) : (
            <Button onClick={() => signIn()}>Iniciar Sesión</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
