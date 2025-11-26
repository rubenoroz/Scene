"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Archive, Trash2, Copy, Undo2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  description: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [view, setView] = useState<'active' | 'archived'>('active');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const fetchProjects = async () => {
    if (session?.user?.id) {
      setLoadingProjects(true);
      try {
        const response = await fetch(`/api/projects?userId=${session.user.id}&archived=${view === 'archived'}`);
        if (!response.ok) {
          const text = await response.text();
          console.error(`Failed to fetch projects: ${response.status} ${response.statusText}`, text);
          throw new Error(text || "Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [session?.user?.id, view]);

  const handleArchive = async (projectId: string, archive: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/archive`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: archive }),
      });
      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Error archiving project:", error);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to permanently delete this project? This action cannot be undone.")) return;
    try {
      const response = await fetch(`/api/projects/${projectId}/archive`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleClone = async (projectId: string) => {
    const confirmClone = confirm("Do you want to clone this project?");
    if (!confirmClone) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/clone`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Project cloned successfully!");
        fetchProjects();
      } else {
        alert("Failed to clone project.");
      }
    } catch (error) {
      console.error("Error cloning project:", error);
    }
  };

  if (status === "loading" || loadingProjects) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <p className="text-lg text-neutral-500">Cargando Dashboard...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const colors = ['bg-green-100', 'bg-purple-100', 'bg-orange-100', 'bg-blue-100', 'bg-pink-100', 'bg-yellow-100'];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="px-8 pt-12 pb-10 text-neutral-800 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Mis Proyectos</h1>
            <p className="text-neutral-500 mt-1">Gestiona y organiza todos tus proyectos</p>
          </div>
          <Link href="/projects/new">
            <button className="px-4 py-2 rounded-lg bg-blue-200 text-neutral-900 font-medium hover:bg-blue-300 transition-all text-sm">
              Nuevo proyecto
            </button>
          </Link>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-8 border-b border-neutral-200">
          <button
            onClick={() => setView('active')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${view === 'active'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-neutral-500 hover:text-neutral-700'
              }`}
          >
            Activos
          </button>
          <button
            onClick={() => setView('archived')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${view === 'archived'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-neutral-500 hover:text-neutral-700'
              }`}
          >
            Archivados
          </button>
        </div>

        {/* Grid de proyectos */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {view === 'active' ? "No hay proyectos activos" : "No hay proyectos archivados"}
              </h2>
              <p className="text-neutral-500 mb-6">
                {view === 'active' ? "Crea un nuevo proyecto para comenzar." : "Los proyectos que archives aparecerán aquí."}
              </p>
              {view === 'active' && (
                <Link href="/projects/new">
                  <button className="px-4 py-2 rounded-lg bg-blue-200 text-neutral-900 font-medium hover:bg-blue-300 transition-all text-sm">
                    <PlusCircle className="inline-block mr-2 h-4 w-4" />
                    Crear mi primer proyecto
                  </button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {projects.map((project, i) => (
              <div key={project.id} className={`relative group rounded-2xl p-6 shadow-sm border border-neutral-200 hover:scale-[1.02] transition-transform h-[350px] flex flex-col ${colors[i % colors.length]}`}>
                <Link href={`/projects/${project.id}`} className="flex-1">
                  <div>
                    <h3 className="text-2xl font-semibold text-neutral-900">{project.name}</h3>
                    <p className="text-neutral-600 text-sm mt-2 line-clamp-3">{project.description || "Sin descripción"}</p>
                  </div>
                </Link>

                {/* Actions Menu */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-white hover:bg-gray-100 text-neutral-700 rounded-full shadow-sm transition-all">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleClone(project.id)}>
                        <Copy className="mr-2 h-4 w-4" /> Clonar
                      </DropdownMenuItem>
                      {view === 'active' ? (
                        <DropdownMenuItem onClick={() => handleArchive(project.id, true)}>
                          <Archive className="mr-2 h-4 w-4" /> Archivar
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => handleArchive(project.id, false)}>
                            <Undo2 className="mr-2 h-4 w-4" /> Desarchivar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
