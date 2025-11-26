"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Film } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el usuario.");
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-neutral-800 p-10 text-white lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Film className="mr-2 h-6 w-6" />
          Scena
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;La herramienta que transforma la complejidad de la producción visual en una sinfonía de colaboración y eficiencia.&rdquo;
            </p>
            <footer className="text-sm text-neutral-400">CEO de Scena</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 bg-neutral-50">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-neutral-900">Crear una cuenta</h1>
            <p className="text-balance text-neutral-500">
              Ingresa tus datos para empezar a gestionar tus proyectos.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-neutral-700">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="border-neutral-300"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-neutral-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-neutral-300"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-neutral-700">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="border-neutral-300"
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg bg-blue-200 text-neutral-900 font-medium hover:bg-blue-300 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-neutral-500">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
