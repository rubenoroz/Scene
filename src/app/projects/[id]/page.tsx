"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation"; // Import useParams

const DynamicKanbanBoard = dynamic(
  () => import("@/components/kanban/KanbanBoard").then((mod) => mod.KanbanBoard),
  { ssr: false }
);

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string; // Extract id from params

  return (
    <div className="px-8 pt-8 pb-10 min-h-screen bg-neutral-50">
      <DynamicKanbanBoard projectId={id} /> {/* Pass projectId to KanbanBoard */}
    </div>
  );
}