"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <p className="text-lg text-neutral-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Scena</h1>
            <p className="text-neutral-500">Gestión de Proyectos Visuales</p>
          </div>

          {session ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                  Bienvenido de nuevo
                </h2>
                <p className="text-neutral-500">
                  {session.user?.name || session.user?.email}
                </p>
              </div>
              <Link href="/dashboard" passHref className="block">
                <button className="w-full px-4 py-3 rounded-lg bg-blue-200 text-neutral-900 font-medium hover:bg-blue-300 transition-all">
                  Ir al Dashboard
                </button>
              </Link>
              <button
                className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-200 text-neutral-900 font-medium hover:bg-gray-300 transition-all"
                onClick={() => signOut()}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
                  Comienza a gestionar tus proyectos
                </h2>
                <p className="text-neutral-500 leading-relaxed">
                  La herramienta definitiva para el seguimiento colaborativo de proyectos.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  className="w-full px-4 py-3 rounded-lg bg-blue-200 text-neutral-900 font-medium hover:bg-blue-300 transition-all"
                  onClick={() => signIn()}
                >
                  Iniciar Sesión
                </button>

                <Link href="/register" passHref className="block">
                  <button className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-neutral-900 font-medium hover:bg-neutral-100 transition-all">
                    Crear una Cuenta
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer text */}
        <p className="text-center mt-6 text-sm text-neutral-500">
          Simplifica la complejidad de la producción visual
        </p>
      </div>
    </div>
  );
}
