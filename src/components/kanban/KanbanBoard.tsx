"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  Active,
  pointerWithin,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Column } from "./Column";
import { Task } from "./Task";
import { Button } from "../ui/button";
import { TaskDetailModal } from "./TaskDetailModal";
import { FilterBar, FilterType } from "./FilterBar";
import { FilterCriteria } from "./FilterBuilder";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";
import { ProjectSettings } from "../project/ProjectSettings";
import { GanttChart } from "../gantt/GanttChart";
import { Settings, X, BarChart3 } from "lucide-react";

interface KanbanBoardProps {
  projectId: string;
}

type FetchedTask = {
  id: string;
  title: string;
  description?: string;
  order: number;
  columnId: string;
  projectId: string;
  parentId?: string | null;
  children?: FetchedTask[];
  priority?: string | null;
  tags?: string | null;
  links?: string | null;
  checklist?: string | null;
  attachments?: string | null;
  assignees?: { id: string; name: string | null; email: string | null; image: string | null }[];
  endDate?: string | null;
  progress?: number; // Add progress
};

type FetchedColumn = {
  id: string;
  name: string;
  color?: string;
  cardColor?: string;
  order: number;
  projectId: string;
  tasks: FetchedTask[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { data: session } = useSession();
  const { can } = usePermissions(projectId);
  const { data: fetchedColumns, error, mutate } = useSWR<FetchedColumn[]>(
    `/api/projects/${projectId}/columns`,
    fetcher
  );

  const [columns, setColumns] = useState<FetchedColumn[]>([]);
  const [tasks, setTasks] = useState<FetchedTask[]>([]);
  const [activeItem, setActiveItem] = useState<Active | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType | string>("all");
  const [customFilterCriteria, setCustomFilterCriteria] = useState<FilterCriteria | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [projectUsers, setProjectUsers] = useState<{ id: string; name: string | null; email: string | null; image: string | null }[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'gantt'>('kanban');

  // Fetch project users for assignment
  useEffect(() => {
    const fetchProjectUsers = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/users`);
        if (response.ok) {
          const users = await response.json();
          // Extract user objects from the response
          setProjectUsers(users.map((u: any) => u.user));
        }
      } catch (error) {
        console.error("Error fetching project users:", error);
      }
    };
    fetchProjectUsers();
  }, [projectId]);

  const selectedTask = useMemo(() =>
    tasks.find((task) => task.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  // Filter tasks based on active filter
  const filteredTasks = useMemo(() => {
    const currentUserId = session?.user?.id;

    // Handle custom filters
    if (customFilterCriteria && activeFilter !== "all" && activeFilter !== "my-tasks" &&
      activeFilter !== "unassigned" && activeFilter !== "overdue" && activeFilter !== "this-week") {
      return tasks.filter(task => {
        const { conditions, operator } = customFilterCriteria;

        const results = conditions.map(condition => {
          switch (condition.field) {
            case "assignee":
              if (condition.operator === "equals") {
                return task.assignees?.some(a => a.id === condition.value);
              }
              if (condition.operator === "isEmpty") {
                return !task.assignees || task.assignees.length === 0;
              }
              if (condition.operator === "isNotEmpty") {
                return task.assignees && task.assignees.length > 0;
              }
              return false;

            case "priority":
              if (condition.operator === "equals") {
                return task.priority === condition.value;
              }
              return false;

            case "tags":
              if (condition.operator === "contains") {
                const tags = task.tags ? JSON.parse(task.tags) : [];
                return tags.some((tag: any) => tag.name === condition.value);
              }
              return false;

            case "column":
              if (condition.operator === "equals") {
                return task.columnId === condition.value;
              }
              return false;

            case "dueDate":
              if (!task.endDate) return condition.operator === "isEmpty";
              const dueDate = new Date(task.endDate);
              const compareDate = new Date(condition.value as string);

              if (condition.operator === "before") {
                return dueDate < compareDate;
              }
              if (condition.operator === "after") {
                return dueDate > compareDate;
              }
              if (condition.operator === "isNotEmpty") {
                return !!task.endDate;
              }
              return false;

            case "hasAttachments":
              const hasAttachments = task.attachments && JSON.parse(task.attachments as any).length > 0;
              return condition.value ? hasAttachments : !hasAttachments;

            case "checklistStatus":
              if (!task.checklist) return false;
              const checklist = JSON.parse(task.checklist);
              const allCompleted = checklist.every((item: any) => item.completed);
              return condition.value ? allCompleted : !allCompleted;

            default:
              return false;
          }
        });

        return operator === "AND" ? results.every(r => r) : results.some(r => r);
      });
    }

    // Handle predefined filters
    switch (activeFilter) {
      case "my-tasks":
        return tasks.filter(task =>
          task.assignees?.some(assignee => assignee.id === currentUserId)
        );

      case "unassigned":
        return tasks.filter(task =>
          !task.assignees || task.assignees.length === 0
        );

      case "overdue":
        return tasks.filter(task => {
          if (!task.endDate) return false;
          const dueDate = new Date(task.endDate);
          return dueDate < new Date();
        });

      case "this-week":
        return tasks.filter(task => {
          if (!task.endDate) return false;
          const dueDate = new Date(task.endDate);
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return dueDate >= new Date() && dueDate <= weekFromNow;
        });

      case "all":
      default:
        return tasks;
    }
  }, [tasks, activeFilter, customFilterCriteria, session?.user?.id]);

  React.useEffect(() => {
    if (fetchedColumns && Array.isArray(fetchedColumns)) {
      console.log("useEffect: fetchedColumns updated", fetchedColumns);
      setColumns(fetchedColumns);
      const allTasks = fetchedColumns.flatMap((col) =>
        col.tasks.map((task) => ({ ...task, columnId: col.id }))
      );
      setTasks(allTasks);
    }
  }, [fetchedColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const columnsId = useMemo(() => {
    const ids = columns.map((col) => col.id);
    console.log("useMemo: columnsId updated", ids);
    return ids;
  }, [columns]);

  const findColumn = useCallback(
    (id: string) => {
      return columns.find((col) => col.id === id);
    },
    [columns]
  );

  const findTask = useCallback(
    (id: string) => {
      return tasks.find((task) => task.id === id);
    },
    [tasks]
  );

  const onDragStart = useCallback((event: DragStartEvent) => {
    console.log("onDragStart: active", event.active.id, "type", event.active.data.current?.type);
    setActiveItem(event.active);
  }, []);

  const onDragOver = useCallback((event: DragOverEvent) => {
    // Empty onDragOver to prevent state updates during drag
  }, []);

  const onDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("onDragEnd: active", active.id, "over", over?.id);
    setActiveItem(null);

    if (!over) {
      console.log("onDragEnd: Dropped outside, calling mutate()");
      mutate(); // If dropped outside, re-mutate to revert
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isActiveAColumn = active.data.current?.type === "Column";
    const isOverAColumn = over.data.current?.type === "Column";

    // Handle Column Reordering
    if (isActiveAColumn && isOverAColumn) {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      const newColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);
      setColumns(newColumns);

      // Update order in backend
      await Promise.all(
        newColumns.map(async (col, index) => {
          if (col.order !== index) {
            await fetch(
              `/api/projects/${projectId}/columns/${col.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: index }),
              }
            );
          }
        })
      );
      console.log("onDragEnd: Column reordered, calling mutate()");
      mutate(); // Re-mutate to refetch and ensure state consistency
      return;
    }

    // Handle Task Movement within or between Columns
    if (isActiveATask) {
      const activeTask = tasks.find((task) => task.id === activeId);
      if (!activeTask) return;

      let newColumnId = activeTask.columnId;
      let newOrder = activeTask.order;

      // Determine the destination column ID
      if (isOverATask) {
        const overTask = tasks.find((task) => task.id === overId);
        if (overTask) {
          newColumnId = overTask.columnId;
        }
      } else if (isOverAColumn) {
        newColumnId = overId;
      }

      // Calculate new order for the task
      const tasksInNewColumn = tasks.filter((t) => t.columnId === newColumnId && t.id !== activeId);

      // Special handling for subtasks: if the task has a parent and the parent is in the new column,
      // position the subtask immediately after its parent
      if (activeTask.parentId) {
        const parentTask = tasks.find((t) => t.id === activeTask.parentId);
        if (parentTask && parentTask.columnId === newColumnId) {
          // Find parent's position in the new column
          const parentIndex = tasksInNewColumn.findIndex(t => t.id === activeTask.parentId);
          if (parentIndex !== -1) {
            // Position subtask right after parent
            newOrder = parentIndex + 1;
          } else {
            // Parent not found in filtered list, use normal logic
            if (isOverATask) {
              const overTaskIndex = tasksInNewColumn.findIndex(t => t.id === overId);
              newOrder = overTaskIndex === -1 ? tasksInNewColumn.length : overTaskIndex;
            } else {
              newOrder = tasksInNewColumn.length;
            }
          }
        } else {
          // Parent is not in the new column, use normal positioning logic
          if (isOverATask) {
            const overTaskIndex = tasksInNewColumn.findIndex(t => t.id === overId);
            newOrder = overTaskIndex === -1 ? tasksInNewColumn.length : overTaskIndex;
          } else {
            newOrder = tasksInNewColumn.length;
          }
        }
      } else {
        // Not a subtask, use normal positioning logic
        if (isOverATask) {
          const overTaskIndex = tasksInNewColumn.findIndex(t => t.id === overId);
          newOrder = overTaskIndex === -1 ? tasksInNewColumn.length : overTaskIndex;
        } else { // Dropped over a column or at the end
          newOrder = tasksInNewColumn.length;
        }
      }

      // Optimistic update for tasks array
      setTasks((prevTasks) => {
        // Find the active task before modifying prevTasks
        const activeTaskInPrev = prevTasks.find((task) => task.id === activeId);
        if (!activeTaskInPrev) return prevTasks; // Should not happen if activeTask is valid

        // Check if this task has children (is a parent task)
        const hasChildren = activeTaskInPrev.children && activeTaskInPrev.children.length > 0;
        const isColumnChanging = activeTaskInPrev.columnId !== newColumnId;

        // Create the moved task with its new properties
        const movedTask = { ...activeTaskInPrev, columnId: newColumnId, order: newOrder };

        // Filter out the active task from its current position
        let tasksWithoutActive = prevTasks.filter((t) => t.id !== activeId);

        // If moving to a different column and has children, also move ALL descendants recursively
        if (isColumnChanging && hasChildren) {
          // Recursive function to get all descendant IDs
          const getAllDescendantIds = (parentTaskId: string, allTasks: typeof prevTasks): string[] => {
            const children = allTasks.filter(t => t.parentId === parentTaskId);
            if (children.length === 0) return [];

            const childIds = children.map(c => c.id);
            const grandchildIds = childIds.flatMap(id => getAllDescendantIds(id, allTasks));

            return [...childIds, ...grandchildIds];
          };

          const descendantIds = getAllDescendantIds(activeId, prevTasks);

          // Update all descendants to the new column
          tasksWithoutActive = tasksWithoutActive.map((t) => {
            if (descendantIds.includes(t.id)) {
              return { ...t, columnId: newColumnId };
            }
            return t;
          });
        }

        if (activeTaskInPrev.columnId === newColumnId) {
          // Moving within the same column
          const columnTasks = tasksWithoutActive
            .filter(t => t.columnId === newColumnId)
            .concat(movedTask)
            .sort((a, b) => a.order - b.order)
            .map((t, index) => ({ ...t, order: index }));

          const otherTasks = prevTasks.filter(t => t.columnId !== newColumnId);
          return [...otherTasks, ...columnTasks];
        } else {
          // Moving between different columns
          const tasksInSourceColumn = tasksWithoutActive
            .filter(t => t.columnId === activeTaskInPrev.columnId)
            .sort((a, b) => a.order - b.order) // Ensure stable sort for re-indexing
            .map((t, index) => ({ ...t, order: index }));

          const tasksInDestinationColumn = tasksWithoutActive
            .filter(t => t.columnId === newColumnId)
            .concat(movedTask) // Add the moved task to the destination column's tasks
            .sort((a, b) => a.order - b.order) // Ensure stable sort for re-indexing
            .map((t, index) => ({ ...t, order: index }));

          // Tasks that were not in the source or destination column
          const otherTasksUnmodified = prevTasks.filter(
            t => t.columnId !== activeTaskInPrev.columnId && t.columnId !== newColumnId
          );

          // Combine all tasks back into a single array
          return [...otherTasksUnmodified, ...tasksInSourceColumn, ...tasksInDestinationColumn];
        }
      });

      // Update backend
      try {
        const response = await fetch(`/api/projects/${projectId}/tasks/${activeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ columnId: newColumnId, order: newOrder }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("onDragEnd: Failed to move task", errorData);
          // Revert optimistic update
          mutate();
          alert(`Failed to move task: ${errorData.message || "Unknown error"}`);
          return;
        }
        console.log("onDragEnd: Task moved successfully, calling mutate()");
        mutate(); // Re-mutate to refetch and ensure state consistency
      } catch (error) {
        console.error("onDragEnd: Error moving task", error);
        mutate();
        alert("An error occurred while moving the task.");
      }
      return;
    }
    console.log("onDragEnd: No valid drag operation, calling mutate()");
    mutate(); // If nothing moved or dropped outside, re-mutate to ensure consistency
  }, [columns, tasks, projectId, mutate]);

  // Function to add a new column
  const handleAddColumn = async () => {
    if (!can(PERMISSIONS.MANAGE_PROJECT)) return;
    const newColumnName = prompt("Enter new column name:");
    if (newColumnName) {
      try {
        const response = await fetch(`/api/projects/${projectId}/columns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newColumnName }),
        });
        if (response.ok) {
          console.log("handleAddColumn: Column added successfully, calling mutate()");
          mutate(); // Re-fetch data to include the new column
        } else {
          console.error("Failed to add column");
        }
      } catch (error) {
        console.error("Error adding column:", error);
      }
    }
  };

  // Function to create a new task within a column
  const handleCreateTask = async (columnId: string) => {
    if (!can(PERMISSIONS.CREATE_TASK)) return;
    const newTaskTitle = prompt("Enter new task title:");
    if (newTaskTitle) {
      try {
        const response = await fetch(`/api/projects/${projectId}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTaskTitle, columnId }),
        });
        if (response.ok) {
          console.log("handleCreateTask: Task added successfully, calling mutate()");
          mutate(); // Re-fetch data to include the new task
        } else {
          console.error("Failed to add task");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleEditColumnName = async (columnId: string, currentName: string) => {
    if (!can(PERMISSIONS.MANAGE_PROJECT)) return;
    const newName = prompt("Edit column name:", currentName);
    if (newName && newName !== currentName) {
      try {
        const response = await fetch(`/api/projects/${projectId}/columns/${columnId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        });
        if (response.ok) {
          console.log("handleEditColumnName: Column name edited successfully, calling mutate()");
          mutate();
        } else {
          console.error("Failed to edit column name");
        }
      } catch (error) {
        console.error("Error editing column name:", error);
      }
    }
  };

  const handleColorChange = async (columnId: string, newColumnColor: string, newCardColor: string) => {
    if (!can(PERMISSIONS.MANAGE_PROJECT)) return;

    // Optimistic update
    const originalColumns = columns;
    const newColumns = columns.map((col) =>
      col.id === columnId ? { ...col, color: newColumnColor, cardColor: newCardColor } : col
    );
    setColumns(newColumns);

    try {
      const response = await fetch(`/api/projects/${projectId}/columns/${columnId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color: newColumnColor, cardColor: newCardColor }),
      });

      if (!response.ok) {
        // Revert on failure
        setColumns(originalColumns);
        alert("Failed to update column color.");
      }
      // No need to call mutate() on success as we already updated optimistically
    } catch (error) {
      // Revert on error
      setColumns(originalColumns);
      console.error("Error updating column color:", error);
      alert("An error occurred while updating the color.");
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!can(PERMISSIONS.MANAGE_PROJECT)) return;
    if (confirm("Are you sure you want to delete this column and all its tasks?")) {
      try {
        const response = await fetch(`/api/projects/${projectId}/columns/${columnId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          console.log("handleDeleteColumn: Column deleted successfully, calling mutate()");
          mutate();
        } else {
          console.error("Failed to delete column");
        }
      } catch (error) {
        console.error("Error deleting column:", error);
      }
    }
  };

  const handleTaskClick = (taskId: string) => {
    console.log("Task clicked:", taskId); // Debugging
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
    console.log("isModalOpen set to true"); // Debugging
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
    console.log("Modal closed"); // Debugging
  };

  const handleProgressChange = async (taskId: string, newProgress: number) => {
    if (!can(PERMISSIONS.EDIT_ANY_TASK)) {
      // Check if it's own task
      const task = tasks.find(t => t.id === taskId);
      const isOwnTask = task?.assignees?.some(a => a.id === session?.user?.id);
      if (!isOwnTask && !can(PERMISSIONS.EDIT_OWN_TASK)) return;
    }

    // Optimistic update
    const originalTasks = tasks;
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, progress: newProgress } : t
    );
    setTasks(updatedTasks);

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      });

      if (response.ok) {
        mutate(); // Re-fetch to ensure consistency (especially for cascade updates)
      } else {
        setTasks(originalTasks);
        console.error("Failed to update progress");
      }
    } catch (error) {
      setTasks(originalTasks);
      console.error("Error updating progress:", error);
    }
  };


  if (error) return <div>Failed to load kanban board.</div>;

  const activeTaskContent = activeItem?.data.current?.type === "Task"
    ? tasks.find(t => t.id === activeItem.id)
    : null;

  return (
    <div>
      <div className="flex flex-col h-screen">
        {/* Header - Always visible */}
        <div className="header">
          <Link href="/dashboard" className="header-title hover:text-gray-300 transition-colors">
            {"< Project"}
          </Link>
          <div className="flex items-center gap-2">
            {/* Filter Bar integrated into header */}
            <div className="mr-4">
              <FilterBar
                projectId={projectId}
                currentUserId={session?.user?.id || ""}
                activeFilter={activeFilter}
                onFilterChange={(filter, criteria) => {
                  setActiveFilter(filter);
                  setCustomFilterCriteria(criteria || null);
                }}
                availableUsers={projectUsers}
                availableColumns={columns.map(col => ({ id: col.id, name: col.name }))}
              />
            </div>
            <Button
              onClick={() => setViewMode(viewMode === 'kanban' ? 'gantt' : 'kanban')}
              variant="ghost"
              size="sm"
              className={`${viewMode === 'gantt'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white text-slate-700 hover:bg-slate-100'
                } border border-slate-200 shadow-sm transition-all`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {viewMode === 'kanban' ? 'Ganttifícalo' : 'Kanban'}
            </Button>
            {can(PERMISSIONS.MANAGE_PROJECT) && (
              <>
                <Button
                  onClick={() => setIsSettingsOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button onClick={handleAddColumn} className="btn-primary">Add Column</Button>
              </>
            )}
          </div>
        </div>

        {/* Content Area - Show loading only if initial load */}
        {!fetchedColumns && columns.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div>Loading...</div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">

            {/* Conditional View: Kanban or Gantt */}
            {viewMode === 'kanban' ? (
              <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
              >
                <div className="h-full overflow-x-auto overflow-y-hidden px-8 pt-8 pb-10 bg-neutral-50">
                  <SortableContext items={columnsId}>
                    <div className="flex gap-4 h-full">
                      {columns.map((col) => {
                        // Filter tasks for this column
                        const columnTasks = filteredTasks.filter(task => task.columnId === col.id).sort((a, b) => a.order - b.order);

                        return (
                          <Column
                            key={col.id}
                            id={col.id}
                            title={col.name}
                            color={col.color}
                            cardColor={col.cardColor}
                            tasks={columnTasks}
                            onEditName={handleEditColumnName}
                            onDelete={handleDeleteColumn}
                            onCreateTask={handleCreateTask}
                            onTaskClick={handleTaskClick}
                            onColorChange={handleColorChange}
                            onProgressChange={handleProgressChange} // Pass handler
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </div>
                {createPortal(
                  <DragOverlay>
                    {activeItem && activeItem.data.current?.type === "Task" && activeTaskContent ? (
                      <Task
                        id={activeTaskContent.id}
                        title={activeTaskContent.title} // Pass title here
                        subtasksCount={activeTaskContent.children?.length || 0}
                      />
                    ) : null}
                    {activeItem && activeItem.data.current?.type === "Column" ? (
                      <div className="column dragging">
                        <h2 className="column-title">{findColumn(activeItem.id.toString())?.name}</h2>
                        {/* Optionally render tasks in the dragged column */}
                      </div>
                    ) : null}
                  </DragOverlay>,
                  document.body
                )}
              </DndContext>
            ) : (
              <div className="h-full px-8 pt-8 pb-10">
                <GanttChart
                  tasks={filteredTasks}
                  columns={columns}
                  onTaskClick={handleTaskClick}
                  onTaskUpdate={mutate}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {/* Project Settings Modal */}
      {isSettingsOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <div className="p-6">
              <ProjectSettings projectId={projectId} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {selectedTask && isModalOpen && (
        <TaskDetailModal
          key={selectedTask.id}
          task={selectedTask}
          onClose={handleCloseModal}
          onTaskUpdate={mutate}
          availableUsers={projectUsers}
        />
      )}
    </div>
  );
}