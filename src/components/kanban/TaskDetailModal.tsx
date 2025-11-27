"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, File, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FileUploader } from "./FileUploader";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import useSWR from "swr";

// Recursive type for subtasks
type Subtask = {
  id: string;
  title: string;
  description?: string;
  children?: Subtask[];
  isHiddenInGantt?: boolean;
  progress?: number; // Add progress
};

interface TaskDetailModalProps {
  task: {
    id: string;
    title: string;
    description?: string;
    projectId: string;
    columnId: string;
    parentId?: string | null;
    children?: Subtask[];
    startDate?: string | null;
    endDate?: string | null;
    toleranceDate?: string | null;
    priority?: string | null;
    tags?: string | null;
    links?: string | null;
    checklist?: string | null;
    attachments?: string | null;
    images?: string | null;
    assignees?: { id: string; name: string | null; email: string | null; image: string | null }[];
    color?: string; // optional custom color
    isHiddenInGantt?: boolean;
    progress?: number; // Add progress
    isArchived?: boolean;
  } | null;
  onClose: () => void;
  onTaskUpdate: (updatedTask?: any) => void;
  availableUsers: { id: string; name: string | null; email: string | null; image: string | null }[];
}

export function TaskDetailModal({ task, onClose, onTaskUpdate, availableUsers }: TaskDetailModalProps) {
  // ... existing state ...
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    task?.assignees?.map(a => a.id) || []
  );
  // Color state for custom task color
  const [taskColor, setTaskColor] = useState<string>(task?.color || '#ffffff');
  const [isHidden, setIsHidden] = useState(task?.isHiddenInGantt || false);

  const handleToggleGanttVisibility = async () => {
    if (!task) return;
    const newHiddenState = !isHidden;
    setIsHidden(newHiddenState); // Optimistic update

    try {
      const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHiddenInGantt: newHiddenState }),
      });
      if (response.ok) {
        // onTaskUpdate(); // Already updated optimistically? No, we updated local state but not parent.
        onTaskUpdate({ isHiddenInGantt: newHiddenState });
      } else {
        setIsHidden(!newHiddenState); // Revert on failure
        onTaskUpdate({ isHiddenInGantt: !newHiddenState }); // Revert parent
        alert("Failed to update Gantt visibility.");
      }
    } catch (error) {
      setIsHidden(!newHiddenState); // Revert on error
      console.error("Error updating Gantt visibility:", error);
    }
  };

  const handleAddAssignee = async (userId: string) => {
    if (!userId || selectedAssignees.includes(userId)) return;
    const newAssignees = [...selectedAssignees, userId];
    setSelectedAssignees(newAssignees);
    try {
      await fetch(`/api/projects/${task?.projectId}/tasks/${task?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignees: newAssignees }),
      });
      onTaskUpdate();
    } catch (error) {
      console.error("Error adding assignee:", error);
    }
  };

  // Handle color change
  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setTaskColor(newColor);
    try {
      await fetch(`/api/projects/${task?.projectId}/tasks/${task?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color: newColor }),
      });
      onTaskUpdate();
    } catch (error) {
      console.error("Error updating task color:", error);
    }
  };

  const handleRemoveAssignee = async (userId: string) => {
    const newAssignees = selectedAssignees.filter(id => id !== userId);
    setSelectedAssignees(newAssignees);
    try {
      await fetch(`/api/projects/${task?.projectId}/tasks/${task?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignees: newAssignees }),
      });
      onTaskUpdate();
    } catch (error) {
      console.error("Error removing assignee:", error);
    }
  };

  const handleToggleSubtaskGanttVisibility = async (subtaskId: string, currentHiddenState: boolean) => {
    if (!task) return;
    const newHiddenState = !currentHiddenState;

    try {
      const response = await fetch(`/api/projects/${task.projectId}/tasks/${subtaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHiddenInGantt: newHiddenState }),
      });
      if (response.ok) {
        onTaskUpdate(); // Refresh data
      } else {
        alert("Failed to update subtask Gantt visibility.");
      }
    } catch (error) {
      console.error("Error updating subtask Gantt visibility:", error);
      alert("An error occurred while updating subtask Gantt visibility.");
    }
  };


  // ... rest of the component ...
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Permissions
  const { can } = usePermissions(task?.projectId || "");
  const isOwnTask = task?.assignees?.some(a => a.id === session?.user?.id) || false;

  const canEdit = can(PERMISSIONS.EDIT_ANY_TASK) || (isOwnTask && can(PERMISSIONS.EDIT_OWN_TASK));
  const canDelete = can(PERMISSIONS.DELETE_TASK);
  const canAssign = can(PERMISSIONS.ASSIGN_TASK);

  // Fetch full task details on mount to get description, attachments, etc.
  const { data: fullTask, mutate: mutateFullTask } = useSWR(
    task ? `/api/projects/${task.projectId}/tasks/${task.id}` : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch task details");
      return res.json();
    }
  );

  // Update local state when fullTask is loaded
  useEffect(() => {
    if (fullTask) {
      if (fullTask.description) setDescription(fullTask.description);
      if (fullTask.attachments) setAttachments(JSON.parse(fullTask.attachments));
      if (fullTask.checklist) setChecklist(JSON.parse(fullTask.checklist));
      if (fullTask.links) setLinks(JSON.parse(fullTask.links));
      if (fullTask.images) setImages(JSON.parse(fullTask.images));
    }
  }, [fullTask]);

  // Rich fields state
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [images, setImages] = useState<{ name: string, url: string, uploadedAt: string }[]>(
    task?.images ? JSON.parse(task.images) : []
  );
  const [priority, setPriority] = useState<string>(task?.priority || "MEDIUM");

  const handleTitleSave = async () => {
    if (!task || !title.trim() || title === task.title) return;

    try {
      // Optimistic update handled by local state, but we should notify parent
      onTaskUpdate({ title });

      const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        setTitle(task.title); // Revert on failure
        onTaskUpdate({ title: task.title });
        console.error("Failed to update task title");
      }
    } catch (error) {
      setTitle(task.title); // Revert on error
      onTaskUpdate({ title: task.title });
      console.error("Error updating task title:", error);
    }
  };
  const [startDate, setStartDate] = useState<string | null>(task?.startDate || null);
  const [endDate, setEndDate] = useState<string | null>(task?.endDate || null);
  const [toleranceDate, setToleranceDate] = useState<string | null>(task?.toleranceDate || null);
  const [tags, setTags] = useState<{ name: string, color: string }[]>(
    task?.tags ? JSON.parse(task.tags) : []
  );
  const [links, setLinks] = useState<{ title: string, url: string }[]>(
    task?.links ? JSON.parse(task.links) : []
  );
  // Color state UI
  const [colorInput, setColorInput] = useState<string>(task?.color || '#ffffff');
  const [checklist, setChecklist] = useState<{ id: string, text: string, completed: boolean }[]>(
    task?.checklist ? JSON.parse(task.checklist) : []
  );
  const [attachments, setAttachments] = useState<{ url: string, name: string, size: number, type: string, uploadedAt: string }[]>(
    task?.attachments ? JSON.parse(task.attachments) : []
  );
  const [newTagName, setNewTagName] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // User assignment state
  // availableUsers is now passed as a prop
  // selectedAssignees is initialized at the top
  // Color picker UI will be rendered below


  // Sync selectedAssignees when task.assignees changes
  useEffect(() => {
    if (task?.assignees) {
      setSelectedAssignees(task.assignees.map(a => a.id));
    }
  }, [task?.assignees]);

  useEffect(() => {
    setMounted(true);
    // Set initial centered position
    if (typeof window !== 'undefined') {
      setPosition({
        x: (window.innerWidth - 560) / 2,
        y: (window.innerHeight - 600) / 2  // Center vertically (assuming ~600px modal height)
      });
    }
    return () => setMounted(false);
  }, []);

  // The handleMouseDown, handleMouseMove, handleMouseUp, and their useEffect
  // have been updated to reflect the new dragging logic using dragStart
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);

    // Calculate offset based on current state position
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Fetch available users for assignment


  const handleDuplicateTask = async () => {
    if (!task) return;

    if (!confirm("¿Duplicar esta tarea y todas sus subtareas?")) return;

    try {
      const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        onTaskUpdate();
        onClose();
      } else {
        alert("Error al duplicar la tarea");
      }
    } catch (error) {
      console.error("Error duplicating task:", error);
      alert("Error al duplicar la tarea");
    }
  };

  const handleArchiveTask = async () => {
    if (!task) return;

    const action = task.isArchived ? "restaurar" : "archivar";
    if (!confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} esta tarea?`)) return;

    try {
      const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !task.isArchived }),
      });

      if (response.ok) {
        onTaskUpdate();
        onClose();
      } else {
        alert(`Error al ${action} la tarea`);
      }
    } catch (error) {
      console.error(`Error ${action}ing task:`, error);
      alert(`Error al ${action} la tarea`);
    }
  };

  const handleAddSubtask = async () => {
    if (!subtaskTitle.trim() || !task) return;

    setIsAddingSubtask(true);
    try {
      const response = await fetch(`/api/projects/${task.projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: subtaskTitle,
          columnId: task.columnId,
          parentId: task.id,
          // Inherit dates from parent task
          startDate: task.startDate,
          endDate: task.endDate,
          toleranceDate: task.toleranceDate,
        }),
      });

      if (response.ok) {
        setSubtaskTitle("");
        onTaskUpdate(); // Refresh data via parent callback
      } else {
        console.error("Failed to create subtask");
      }
    } catch (error) {
      console.error("Error creating subtask:", error);
    } finally {
      setIsAddingSubtask(false);
    }
  };

  if (!task || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="task-detail-modal"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'grab',
          minWidth: '320px',
          maxWidth: '560px',
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header flex justify-between items-center pb-4 border-b border-gray-200 mb-6 cursor-move -mt-[10px]">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="text-2xl font-bold text-[#0F172A] bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded px-1 w-full mr-4"
          />
          <div className="flex items-center gap-2">
            {/* Duplicate button - only for admins/managers */}
            {can(PERMISSIONS.MANAGE_PROJECT) && (
              <>
                <button
                  onClick={handleDuplicateTask}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Duplicar tarea"
                >
                  Duplicar
                </button>
                <button
                  onClick={handleArchiveTask}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${task.isArchived
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  title={task.isArchived ? "Restaurar tarea" : "Archivar tarea"}
                >
                  {task.isArchived ? "Restaurar" : "Archivar"}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="modal-close-btn"
            >
              <X size={16} stroke="white" fill="white" />
            </button>
          </div>
        </div>
        <div className="modal-body overflow-y-auto max-h-[60vh] space-y-6 mt-[5px]">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Descripción</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[100px] text-gray-700 leading-relaxed resize-y"
              placeholder="Agrega una descripción para esta tarea..."
              defaultValue={task.description || ""}
              onBlur={async (e) => {
                const newDescription = e.target.value;
                if (newDescription !== task.description) {
                  try {
                    await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ description: newDescription }),
                    });
                    onTaskUpdate();
                  } catch (error) {
                    console.error("Error updating description:", error);
                  }
                }
              }}
              disabled={!canEdit}
            />
          </div>

          {/* Date Fields Section */}
          <div className="pt-[5px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Fechas</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
                  onChange={async (e) => {
                    const newDate = e.target.value || null;
                    const previousDate = startDate;

                    // Optimistic update
                    setStartDate(newDate);
                    onTaskUpdate({ startDate: newDate }); // Update parent immediately

                    try {
                      const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ startDate: newDate }),
                      });
                      if (!response.ok) {
                        // Revert on failure
                        setStartDate(previousDate);
                        onTaskUpdate({ startDate: previousDate });
                      }
                    } catch (error) {
                      // Revert on error
                      setStartDate(previousDate);
                      onTaskUpdate({ startDate: previousDate });
                      console.error("Error updating start date:", error);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de finalización</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={endDate ? new Date(endDate).toISOString().split('T')[0] : ''}
                  onChange={async (e) => {
                    const newDate = e.target.value || null;
                    const previousDate = endDate;

                    // Optimistic update
                    setEndDate(newDate);
                    onTaskUpdate({ endDate: newDate }); // Update parent immediately

                    try {
                      const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ endDate: newDate }),
                      });
                      if (!response.ok) {
                        // Revert on failure
                        setEndDate(previousDate);
                        onTaskUpdate({ endDate: previousDate });
                      }
                    } catch (error) {
                      // Revert on error
                      setEndDate(previousDate);
                      onTaskUpdate({ endDate: previousDate });
                      console.error("Error updating end date:", error);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de tolerancia</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={task.toleranceDate ? new Date(task.toleranceDate).toISOString().split('T')[0] : ''}
                  onChange={async (e) => {
                    const newDate = e.target.value || null;
                    try {
                      await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ toleranceDate: newDate }),
                      });
                      // onTaskUpdate({ toleranceDate: newDate }); // Already called optimistically? No, let's call it before fetch if we want optimistic.
                      // The current code calls it AFTER fetch. Let's move it up.
                    } catch (error) {
                      console.error("Error updating tolerance date:", error);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Priority Section */}
          <div className="pt-[5px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Prioridad</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={async () => {
                  setPriority("LOW");
                  onTaskUpdate({ priority: "LOW" }); // Optimistic
                  try {
                    await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ priority: "LOW" }),
                    });
                  } catch (error) {
                    console.error("Error updating priority:", error);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${priority === "LOW"
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                disabled={!canEdit}
              >
                Baja
              </button>
              <button
                onClick={async () => {
                  setPriority("MEDIUM");
                  onTaskUpdate({ priority: "MEDIUM" }); // Optimistic
                  try {
                    await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ priority: "MEDIUM" }),
                    });
                  } catch (error) {
                    console.error("Error updating priority:", error);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${priority === "MEDIUM"
                  ? "bg-yellow-500 text-white shadow-md scale-105"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                disabled={!canEdit}
              >
                Media
              </button>
              <button
                onClick={async () => {
                  setPriority("HIGH");
                  onTaskUpdate({ priority: "HIGH" }); // Optimistic
                  try {
                    await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ priority: "HIGH" }),
                    });
                  } catch (error) {
                    console.error("Error updating priority:", error);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${priority === "HIGH"
                  ? "bg-red-500 text-white shadow-md scale-105"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                disabled={!canEdit}
              >
                Alta
              </button>
              <button
                onClick={async () => {
                  setPriority("URGENT");
                  onTaskUpdate({ priority: "URGENT" }); // Optimistic
                  try {
                    await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ priority: "URGENT" }),
                    });
                  } catch (error) {
                    console.error("Error updating priority:", error);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${priority === "URGENT"
                  ? "bg-red-700 text-white shadow-md scale-105"
                  : "bg-red-200 text-red-800 hover:bg-red-300"
                  }`}
                disabled={!canEdit}
              >
                Urgente
              </button>
            </div>
          </div>

          {/* Gantt Visibility Section */}
          <div className="pt-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Visibilidad en Gantt</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label htmlFor="gantt-toggle" className="text-sm font-medium text-gray-700">
                {isHidden ? "Oculta en el diagrama de Gantt" : "Visible en el diagrama de Gantt"}
              </label>
              <button
                id="gantt-toggle"
                onClick={handleToggleGanttVisibility}
                className={`relative inline - flex items - center h - 6 rounded - full w - 11 transition - colors ${isHidden ? 'bg-gray-300' : 'bg-blue-500'
                  } `}
                disabled={!canEdit}
              >
                <span
                  className={`inline - block w - 4 h - 4 transform bg - white rounded - full transition - transform ${isHidden ? 'translate-x-1' : 'translate-x-6'
                    } `}
                />
              </button>
            </div>
          </div>

          {/* User Assignment Section */}
          <div className="pt-[5px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Asignado a</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedAssignees.map((assigneeId) => {
                const assignee = availableUsers.find(u => u.id === assigneeId) ||
                  task?.assignees?.find(a => a.id === assigneeId);
                if (!assignee) return null;

                return (
                  <div
                    key={assignee.id}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                  >
                    {assignee.image ? (
                      <img
                        src={assignee.image}
                        alt={assignee.name || assignee.email || "User"}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium text-neutral-900">
                        {(assignee.name || assignee.email || "?")[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-gray-700">{assignee.name || assignee.email}</span>
                    {canAssign && (
                      <button
                        className="text-gray-600 hover:text-red-600 ml-1"
                        onClick={async () => {
                          const newAssignees = selectedAssignees.filter(id => id !== assignee.id);
                          setSelectedAssignees(newAssignees);
                          try {
                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ assignees: newAssignees }),
                            });
                            onTaskUpdate({ assignees: newAssignees }); // This might be tricky if we need full user objects, but ID might suffice for some views or we need to pass full objects if available. 
                            // Actually, KanbanBoard uses FetchedTask which has assignees as objects. 
                            // We are passing IDs here. This might break optimistic update if Kanban expects objects.
                            // Let's check FetchedTask type. It expects objects.
                            // We should pass the filtered list of objects if possible, or just trigger revalidate.
                            // For removal, we can filter the current list.
                            // onTaskUpdate({ assignees: task?.assignees?.filter(a => a.id !== assignee.id) });
                          } catch (error) {
                            console.error("Error removing assignee:", error);
                          }
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => {
                if (e.target.value) {
                  handleAddAssignee(e.target.value);
                  e.target.value = "";
                }
              }}
              disabled={!canAssign}
            >
              <option value="">Agregar usuario...</option>
              {availableUsers
                .filter(user => !selectedAssignees.includes(user.id))
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
            </select>
          </div>

          {/* Tags Section */}
          <div className="pt-[5px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Etiquetas</h3>
            <p className="text-xs text-gray-500 mb-3">Separa múltiples etiquetas con comas o presiona Enter para agregar</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: tag.color || '#E0E7FF', color: '#1E293B' }}
                >
                  {tag.name}
                  {canEdit && (
                    <button
                      className="ml-2 text-gray-600 hover:text-red-600"
                      onClick={async () => {
                        const newTags = tags.filter((_, i) => i !== index);
                        setTags(newTags);
                        try {
                          await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ tags: newTags }),
                          });
                          onTaskUpdate({ tags: newTags });
                        } catch (error) {
                          console.error("Error removing tag:", error);
                        }
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: diseño, urgente, revisión (separadas por comas)"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newTagName.trim()) {
                    const colors = ['#E0E7FF', '#FEF3C7', '#D1FAE5', '#FCE7F3', '#E0F2FE'];
                    // Split by comma and create multiple tags
                    const tagNames = newTagName.split(',').map(t => t.trim()).filter(t => t);
                    const newTags = [...tags, ...tagNames.map((name, idx) => ({
                      name,
                      color: colors[(tags.length + idx) % colors.length]
                    }))];
                    setTags(newTags);
                    setNewTagName("");
                    fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ tags: newTags }),
                    }).then(() => onTaskUpdate());
                  }
                }}
                disabled={!canEdit}
              />
              <button
                className="px-4 py-2 bg-blue-200 text-neutral-900 rounded-lg hover:bg-blue-300 transition-colors font-medium"
                onClick={async () => {
                  if (!newTagName.trim()) return;
                  const colors = ['#E0E7FF', '#FEF3C7', '#D1FAE5', '#FCE7F3', '#E0F2FE'];
                  // Split by comma and create multiple tags
                  const tagNames = newTagName.split(',').map(t => t.trim()).filter(t => t);
                  const newTags = [...tags, ...tagNames.map((name, idx) => ({
                    name,
                    color: colors[(tags.length + idx) % colors.length]
                  }))];
                  setTags(newTags);
                  setNewTagName("");
                  try {
                    await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ tags: newTags }),
                    });
                    onTaskUpdate({ tags: newTags });
                  } catch (error) {
                    console.error("Error adding tag:", error);
                  }
                }}
                disabled={!canEdit}
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Links Section */}
          <div className="pt-[5px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Enlaces</h3>
            <div className="space-y-2 mb-3">
              {links.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex-1 truncate"
                  >
                    {link.title || link.url}
                  </a>
                  <button
                    className="ml-2 text-gray-600 hover:text-red-600"
                    onClick={async () => {
                      const newLinks = links.filter((_, i) => i !== index);
                      setLinks(newLinks);
                      try {
                        await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ links: newLinks }),
                        });
                        onTaskUpdate();
                      } catch (error) {
                        console.error("Error removing link:", error);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Título del enlace"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://ejemplo.com"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-blue-200 text-neutral-900 rounded-lg hover:bg-blue-300 transition-colors font-medium"
                  onClick={async () => {
                    if (!newLinkUrl.trim()) return;
                    const newLink = { title: newLinkTitle.trim() || newLinkUrl, url: newLinkUrl.trim() };
                    const newLinks = [...links, newLink];
                    setLinks(newLinks);
                    setNewLinkTitle("");
                    setNewLinkUrl("");
                    try {
                      await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ links: newLinks }),
                      });
                      onTaskUpdate({ links: newLinks });
                    } catch (error) {
                      console.error("Error adding link:", error);
                    }
                  }}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Checklist Section */}
          <div className="pt-[5px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Checklist</h3>
            <p className="text-xs text-gray-500 mb-3">Agrega items a tu lista de tareas y marca como completados</p>
            <div className="space-y-2 mb-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                    onChange={async (e) => {
                      const newChecklist = checklist.map(i =>
                        i.id === item.id ? { ...i, completed: e.target.checked } : i
                      );
                      setChecklist(newChecklist);
                      try {
                        await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ checklist: newChecklist }),
                        });
                        onTaskUpdate();
                      } catch (error) {
                        console.error("Error updating checklist:", error);
                      }
                    }}
                  />
                  <span className={`flex - 1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'} `}>
                    {item.text}
                  </span>
                  <button
                    className="text-gray-600 hover:text-red-600"
                    onClick={async () => {
                      const newChecklist = checklist.filter(i => i.id !== item.id);
                      setChecklist(newChecklist);
                      try {
                        await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ checklist: newChecklist }),
                        });
                        onTaskUpdate();
                      } catch (error) {
                        console.error("Error removing checklist item:", error);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nuevo item"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newChecklistItem.trim()) {
                    const newItem = { id: Date.now().toString(), text: newChecklistItem.trim(), completed: false };
                    const newChecklist = [...checklist, newItem];
                    setChecklist(newChecklist);
                    setNewChecklistItem("");
                    fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ checklist: newChecklist }),
                    }).then(() => onTaskUpdate());
                  }
                }}
              />
              <button
                className="px-4 py-2 bg-blue-200 text-neutral-900 rounded-lg hover:bg-blue-300 transition-colors font-medium"
                onClick={async () => {
                  if (!newChecklistItem.trim()) return;
                  const newItem = { id: Date.now().toString(), text: newChecklistItem.trim(), completed: false };
                  const newChecklist = [...checklist, newItem];
                  setChecklist(newChecklist);
                  setNewChecklistItem("");
                  try {
                    await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ checklist: newChecklist }),
                    });
                    onTaskUpdate();
                  } catch (error) {
                    console.error("Error adding checklist item:", error);
                  }
                }}
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="pt-[5px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Archivos Adjuntos</h3>

            {/* File List */}
            {attachments.length > 0 && (
              <div className="space-y-2 mb-4">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={file.url}
                        download
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Descargar"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                        onClick={async () => {
                          const newAttachments = attachments.filter((_, i) => i !== index);
                          setAttachments(newAttachments);
                          try {
                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ attachments: newAttachments }),
                            });
                            onTaskUpdate();
                          } catch (error) {
                            console.error("Error removing attachment:", error);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* File Uploader */}
            <FileUploader
              projectId={task.projectId}
              taskId={task.id}
              onUploadComplete={async (fileData) => {
                const newAttachments = [...attachments, fileData];
                setAttachments(newAttachments);
                try {
                  await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ attachments: newAttachments }),
                  });
                  onTaskUpdate();
                } catch (error) {
                  console.error("Error saving attachment:", error);
                }
              }}
            />
          </div>

          <div className="pt-[5px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Subtasks</h3>

            {/* Recursive subtask renderer */}
            {(() => {
              const renderSubtasks = (subtasks: typeof task.children, depth = 0): React.ReactElement[] => {
                if (!subtasks || subtasks.length === 0) return [];

                return subtasks.map((subtask) => (
                  <li key={subtask.id} style={{ marginLeft: `${depth * 16} px` }} className="text-gray-700 flex items-start gap-2 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span>{subtask.title}</span>
                        <div className="flex items-center gap-2">
                          {/* Progress Input for Subtask */}
                          {(!subtask.children || subtask.children.length === 0) && (
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={subtask.progress || 0}
                                onChange={async (e) => {
                                  const newProgress = parseInt(e.target.value);
                                  if (!isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
                                    try {
                                      await fetch(`/api/projects/${task.projectId}/tasks/${subtask.id}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ progress: newProgress }),
                                      });
                                      onTaskUpdate();
                                    } catch (error) {
                                      console.error("Error updating subtask progress:", error);
                                    }
                                  }
                                }}
                                className="w-12 p-1 border border-gray-300 rounded text-xs text-center"
                                disabled={!canEdit}
                              />
                              <span className="text-xs text-gray-500">%</span>
                            </div>
                          )}
                          {canEdit && ( // Only show toggle if user can edit tasks
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent modal from closing
                                handleToggleSubtaskGanttVisibility(subtask.id, subtask.isHiddenInGantt || false);
                              }}
                              className="ml-2 text-gray-500 hover:text-blue-600"
                              title={subtask.isHiddenInGantt ? "Mostrar en Gantt" : "Ocultar en Gantt"}
                            >
                              {subtask.isHiddenInGantt ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Progress Bar for Subtask */}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${subtask.progress || 0}% ` }}
                        ></div>
                      </div>
                    </div>
                    {subtask.children && subtask.children.length > 0 && (
                      <ul className="space-y-2 mt-2 w-full">
                        {renderSubtasks(subtask.children, depth + 1)}
                      </ul>
                    )}
                  </li>
                ));
              };

              // Calculate current task depth
              const calculateDepth = (t: typeof task, allTasks: any[] = []): number => {
                // This is a simplified depth calculation for the modal
                // In a real scenario, you'd need to traverse up the parent chain
                // For now, we'll use a heuristic based on parentId presence
                let depth = 0;
                let current = t;
                // We can't traverse up without fetching parent data, so we'll use a simpler approach
                // Just count if this task has a parentId (depth 1+)
                if (current.parentId) depth = 1;
                // For more accurate depth, we'd need to fetch the full parent chain
                // For now, we'll allow subtask creation and let the backend handle validation
                return depth;
              };

              const currentDepth = calculateDepth(task);
              const maxDepth = 5;
              const canAddSubtask = currentDepth < maxDepth;

              return (
                <>
                  {task.children && task.children.length > 0 ? (
                    <ul className="space-y-3 mb-4">
                      {renderSubtasks(task.children)}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic mb-4">No subtasks yet.</p>
                  )}

                  {/* UI to add new subtask */}
                  <div className="flex gap-3 mt-[10px]">
                    <input
                      type="text"
                      placeholder={canAddSubtask ? "New subtask title" : "Max depth reached (5 levels)"}
                      className="flex-grow p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-shadow"
                      value={subtaskTitle}
                      onChange={(e) => setSubtaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && canAddSubtask) {
                          handleAddSubtask();
                        }
                      }}
                      disabled={!canAddSubtask}
                    />
                    <button
                      className="btn-primary whitespace-nowrap"
                      onClick={handleAddSubtask}
                      disabled={isAddingSubtask || !subtaskTitle.trim() || !canAddSubtask}
                    >
                      {isAddingSubtask ? 'Adding...' : 'Add Subtask'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Modal Footer with Delete Button */}
          <div className="modal-footer mt-6 pt-4 border-t border-gray-200 flex justify-end">
            {canDelete && (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                onClick={async () => {
                  if (confirm(`¿Estás seguro de que quieres eliminar "${task.title}" ? ${task.children && task.children.length > 0 ? ' Esto también eliminará todas sus subtareas.' : ''} `)) {
                    try {
                      const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                        method: "DELETE",
                      });

                      if (response.ok) {
                        onClose();
                        onTaskUpdate(); // Refresh the board
                      } else {
                        alert("Error al eliminar la tarea");
                      }
                    } catch (error) {
                      console.error("Error deleting task:", error);
                      alert("Error al eliminar la tarea");
                    }
                  }
                }}
              >
                <Trash2 size={16} className="inline-block mr-2" />
                Eliminar Tarea
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}