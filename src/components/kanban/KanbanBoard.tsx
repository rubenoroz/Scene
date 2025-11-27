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
import { Settings, X, BarChart3, Eye, EyeOff, Archive, Printer, FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "@/lib/excel";

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
  progress?: number;
  isArchived?: boolean;
  isHiddenInGantt?: boolean; // Add isHiddenInGantt
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

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  return res.json();
};

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { data: session } = useSession();
  const { can } = usePermissions(projectId);
  const { data: fetchedColumns, error: columnsError, mutate: mutateColumns } = useSWR<FetchedColumn[]>(
    `/api/projects/${projectId}/columns`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 10000,
    }
  );

  const { data: fetchedTasks, error: tasksError, mutate: mutateTasks } = useSWR<FetchedTask[]>(
    `/api/projects/${projectId}/tasks`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 10000,
    }
  );

  // Combined mutate function
  const mutate = useCallback(async () => {
    await Promise.all([mutateColumns(), mutateTasks()]);
  }, [mutateColumns, mutateTasks]);

  const [columns, setColumns] = useState<FetchedColumn[]>([]);
  const [tasks, setTasks] = useState<FetchedTask[]>([]);
  const [activeItem, setActiveItem] = useState<Active | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType | string>("all");
  const [customFilterCriteria, setCustomFilterCriteria] = useState<FilterCriteria | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Collapsed tasks state - persisted in localStorage
  const [collapsedTasks, setCollapsedTasks] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`collapsed-tasks-${projectId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  // Reconstruct hierarchy from flat tasks
  const processedData = useMemo(() => {
    if (!fetchedColumns || !fetchedTasks || !Array.isArray(fetchedColumns) || !Array.isArray(fetchedTasks)) {
      return { columns: [], tasks: [] };
    }

    // 1. Create a map of tasks by ID for easy lookup
    const taskMap = new Map<string, FetchedTask>();
    fetchedTasks.forEach(t => {
      taskMap.set(t.id, { ...t, children: [] }); // Initialize children array
    });

    // 2. Build the tree structure
    const rootTasks: FetchedTask[] = [];

    // Sort tasks by order first to ensure children are added in correct order if that matters,
    // though we usually sort children later.
    const sortedTasks = [...fetchedTasks].sort((a, b) => a.order - b.order);

    sortedTasks.forEach(t => {
      const task = taskMap.get(t.id);
      if (!task) return; // Safety check
      if (t.parentId && taskMap.has(t.parentId)) {
        const parent = taskMap.get(t.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(task);
      } else {
        rootTasks.push(task);
      }
    });

    // 3. Assign root tasks to columns
    const columnsWithTasks = fetchedColumns.map(col => ({
      ...col,
      tasks: rootTasks.filter(t => t.columnId === col.id).sort((a, b) => a.order - b.order)
    }));

    return { columns: columnsWithTasks, tasks: Array.from(taskMap.values()) };
  }, [fetchedColumns, fetchedTasks]);

  useEffect(() => {
    if (processedData.columns.length > 0) {
      setColumns(processedData.columns);
      setTasks(processedData.tasks);
    }
  }, [processedData]);

  // Hidden tasks state - persisted in localStorage
  const [hiddenTasks, setHiddenTasks] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`hidden-tasks-${projectId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [showHiddenTasks, setShowHiddenTasks] = useState(false);
  const [showArchivedTasks, setShowArchivedTasks] = useState(false); // New state for archived tasks

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

  // Effect to sync columns when fetchedColumns changes
  // Removed: Handled by processedData useMemo and useEffect above


  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `collapsed-tasks-${projectId}`,
        JSON.stringify(Array.from(collapsedTasks))
      );
    }
  }, [collapsedTasks, projectId]);

  // Toggle collapse state for a task
  const toggleTaskCollapse = (taskId: string) => {
    setCollapsedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Save hidden state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `hidden-tasks-${projectId}`,
        JSON.stringify(Array.from(hiddenTasks))
      );
    }
  }, [hiddenTasks, projectId]);

  // Toggle hidden state for a task
  const toggleTaskHide = (taskId: string) => {
    setHiddenTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Memoize task map for O(1) lookup
  const taskMap = useMemo(() => new Map(tasks.map(t => [t.id, t])), [tasks]);

  // Filter out subtasks of collapsed parent tasks (only if in same column) AND archived tasks AND hidden tasks
  const visibleTasks = useMemo(() => {
    return tasks.filter(task => {
      // Handle archived tasks
      if (task.isArchived) {
        return showArchivedTasks; // Only show if toggle is on
      }
      // If showing archived tasks, hide non-archived ones
      if (showArchivedTasks) return false;

      // Hide temporarily hidden tasks (unless showHiddenTasks is true)
      if (!showHiddenTasks && hiddenTasks.has(task.id)) return false;

      // If task has no parent, it's always visible (unless archived/hidden)
      if (!task.parentId) return true;

      // Check if any ancestor is collapsed AND in the same column
      let currentParentId: string | null | undefined = task.parentId;
      while (currentParentId) {
        const parent = taskMap.get(currentParentId);
        if (!parent) break;

        // Only hide if parent is collapsed AND task is in same column as parent
        if (collapsedTasks.has(currentParentId) && task.columnId === parent.columnId) {
          return false; // Hide if parent is collapsed and in same column
        }

        currentParentId = parent.parentId || null;
      }
      return true;
    });
  }, [tasks, taskMap, collapsedTasks, hiddenTasks, showHiddenTasks, showArchivedTasks]);

  const filteredTaskIds = useMemo(() => new Set(filteredTasks.map(t => t.id)), [filteredTasks]);

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

      // Update server in background
      try {
        const response = await fetch(`/api/projects/${projectId}/tasks/${activeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ columnId: newColumnId, order: newOrder }),
        });
        if (!response.ok) {
          console.error("onDragEnd: Failed to move task on server");
          // Revert optimistic update on failure
          mutate();
          alert("Failed to move task. Please try again.");
          return;
        }
        console.log("onDragEnd: Task moved successfully on server");
        // Revalidate to ensure consistency with server
        mutate();
      } catch (error) {
        console.error("onDragEnd: Error moving task", error);
        // Revert optimistic update on error
        mutate();
        alert("An error occurred while moving the task.");
      }
      return;
    }
    console.log("onDragEnd: No valid drag operation");
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
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempTask: FetchedTask = {
        id: tempId,
        title: newTaskTitle,
        columnId,
        projectId,
        order: tasks.filter(t => t.columnId === columnId).length,
        assignees: [], // Initially empty
        // Add other required fields with defaults
      };

      const originalTasks = tasks;
      setTasks([...tasks, tempTask]);

      try {
        const response = await fetch(`/api/projects/${projectId}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTaskTitle, columnId }),
        });
        if (response.ok) {
          console.log("handleCreateTask: Task added successfully, calling mutate()");
          mutate(); // Re-fetch data to include the new task with real ID
        } else {
          console.error("Failed to add task");
          setTasks(originalTasks); // Revert on failure
          alert("Failed to create task.");
        }
      } catch (error) {
        console.error("Error adding task:", error);
        setTasks(originalTasks); // Revert on error
        alert("Error creating task.");
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

  const handleToggleGanttVisibility = async (taskId: string) => {
    if (!can(PERMISSIONS.EDIT_ANY_TASK)) {
      // Check if it's own task
      const task = tasks.find(t => t.id === taskId);
      const isOwnTask = task?.assignees?.some(a => a.id === session?.user?.id);
      if (!isOwnTask && !can(PERMISSIONS.EDIT_OWN_TASK)) return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newIsHidden = !task.isHiddenInGantt;

    // Optimistic update
    const originalTasks = tasks;
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, isHiddenInGantt: newIsHidden } : t
    );
    setTasks(updatedTasks);

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHiddenInGantt: newIsHidden }),
      });

      if (!response.ok) {
        setTasks(originalTasks);
        console.error("Failed to update Gantt visibility");
      }
      // No need to mutate immediately if optimistic update works, but good for consistency
      mutate();
    } catch (error) {
      setTasks(originalTasks);
      console.error("Error updating Gantt visibility:", error);
    }
  };

  const handleExportExcel = () => {
    // Prepare data for export
    // We need to flatten the tasks same way Gantt does to preserve order/hierarchy if possible
    // Or just use the filteredTasks directly.
    // Let's use filteredTasks but we need to calculate levels if we want indentation.

    // Actually, let's reuse the flattening logic from GanttChart if we can, 
    // but that's inside GanttChart. 
    // For now, let's just export the flat list of filtered tasks.
    // We can try to reconstruct hierarchy if needed, but flat list is often better for Excel.
    // However, the utility supports 'level'.

    // Let's do a simple hierarchy calculation here
    const taskMap = new Map(filteredTasks.map(t => [t.id, t]));
    const processedIds = new Set<string>();
    const exportData: any[] = [];

    const processTask = (task: FetchedTask, level: number) => {
      if (processedIds.has(task.id)) return;
      processedIds.add(task.id);

      exportData.push({ ...task, level });

      if (task.children) {
        task.children.forEach(child => {
          // The children in 'task.children' might not be the full objects if not eager loaded deep enough,
          // but filteredTasks should have them.
          // Actually, filteredTasks is a flat array.
          // We need to find the child in filteredTasks to get its full data.
          const fullChild = taskMap.get(child.id);
          if (fullChild) {
            processTask(fullChild, level + 1);
          }
        });
      }
    };

    // Find roots in the filtered set, excluding hidden tasks
    const roots = filteredTasks.filter(t =>
      (!t.parentId || !taskMap.has(t.parentId)) &&
      !t.isHiddenInGantt
    );
    roots.forEach(t => processTask(t, 0));

    exportToExcel(exportData, columns, "Proyecto");
  };

  // Global optimistic update handler for TaskDetailModal
  const handleTaskUpdate = useCallback((updatedTaskData?: Partial<FetchedTask>) => {
    if (updatedTaskData && selectedTaskId) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === selectedTaskId ? { ...t, ...updatedTaskData } : t
        )
      );
    }
    // Always trigger a background revalidation
    mutate();
  }, [selectedTaskId, mutate]);


  if (columnsError || tasksError) return <div>Failed to load kanban board.</div>;

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
            {/* Show Archived Tasks Toggle */}
            <Button
              onClick={() => setShowArchivedTasks(!showArchivedTasks)}
              variant="ghost"
              size="sm"
              className={`bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm transition-all ${showArchivedTasks ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}`}
              title={showArchivedTasks ? "Volver a tareas activas" : "Ver tareas archivadas"}
            >
              <Archive className="w-4 h-4 mr-2" />
              {showArchivedTasks ? "Activas" : "Archivadas"}
            </Button>
            {/* Show Hidden Tasks Toggle */}
            <Button
              onClick={() => setShowHiddenTasks(!showHiddenTasks)}
              variant="ghost"
              size="sm"
              className={`bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm transition-all ${showHiddenTasks ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
              title={showHiddenTasks ? "Ocultar tareas escondidas" : "Mostrar tareas escondidas"}
            >
              {showHiddenTasks ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {showHiddenTasks ? "Ocultar" : "Mostrar"}
            </Button>
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
            {viewMode === 'gantt' && (
              <Button
                onClick={() => window.print()}
                variant="ghost"
                size="sm"
                className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
                title="Imprimir Gantt a PDF"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            )}
            {viewMode === 'gantt' && (
              <Button
                onClick={handleExportExcel}
                variant="ghost"
                size="sm"
                className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
                title="Descargar Excel"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
            )}
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
                {/* Add Column Button - Only for Managers */}
                {can(PERMISSIONS.MANAGE_PROJECT) && (
                  <Button onClick={handleAddColumn} className="btn-primary">Add Column</Button>
                )}
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
                        const columnTasks = visibleTasks
                          .filter(task => task.columnId === col.id && filteredTaskIds.has(task.id))
                          .sort((a, b) => a.order - b.order);

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
                            collapsedTasks={collapsedTasks}
                            onToggleCollapse={toggleTaskCollapse}
                            onToggleHide={toggleTaskHide}
                            hiddenTasks={hiddenTasks}
                            onToggleGanttVisibility={handleToggleGanttVisibility} // New prop
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
              <div className="h-full px-8 pt-8 pb-10 gantt-print-container">
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
          onTaskUpdate={handleTaskUpdate}
          availableUsers={projectUsers}
        />
      )}
    </div>
  );
}