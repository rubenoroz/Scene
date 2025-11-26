import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./Task";
import { Plus, X, GripVertical, Palette } from "lucide-react";
import { pastelColorPairs } from "@/lib/colors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnProps {
  id: string;
  title: string;
  color?: string;
  cardColor?: string;
  tasks: any[];
  onEditName: (columnId: string, newName: string) => void;
  onDelete: (columnId: string) => void;
  onCreateTask: (columnId: string) => void;
  onTaskClick: (taskId: string) => void;
  onColorChange: (columnId: string, newColumnColor: string, newCardColor: string) => void;
  onProgressChange: (taskId: string, newProgress: number) => void; // New prop
}

export function Column({ id, title, color, cardColor, tasks, onEditName, onDelete, onCreateTask, onTaskClick, onColorChange, onProgressChange }: ColumnProps) {
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id,
    data: {
      type: "Column",
    },
  });

  const {
    setNodeRef: setSortableNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id, data: { type: "Column" } });

  const dynamicStyle = {
    transition: isDragging ? transition : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: CSS.Transform.toString(transform),
    backgroundColor: color || "#FFFFFF",
    opacity: isDragging ? 0.6 : 1,
  };

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (newTitle.trim() !== "" && newTitle.trim() !== title) {
      onEditName(id, newTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleTitleBlur();
    if (e.key === "Escape") {
      setNewTitle(title);
      setIsEditingTitle(false);
    }
  };

  return (
    <section
      ref={(node) => {
        setDroppableNodeRef(node);
        setSortableNodeRef(node);
      }}
      style={dynamicStyle}
      {...attributes}
      className={`column flex-shrink-0 h-full p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${isDragging ? "dragging shadow-2xl scale-105" : ""}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button {...listeners} className="cursor-grab text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110 active:cursor-grabbing">
            <GripVertical size={20} />
          </button>
          {isEditingTitle ? (
            <input
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="column-title-edit"
              autoFocus
            />
          ) : (
            <h2 className="column-title" onDoubleClick={handleTitleDoubleClick}>
              {title}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full w-8 h-8 flex items-center justify-center bg-white/50 hover:bg-white/80 transition-all duration-200 hover:scale-110 active:scale-95">
                <Palette size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="grid grid-cols-3 gap-2 p-2">
                {pastelColorPairs.map((pair) => (
                  <DropdownMenuItem
                    key={pair.column}
                    onSelect={() => onColorChange(id, pair.column, pair.card)}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    style={{ backgroundColor: pair.column }}
                  />
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={() => onCreateTask(id)} className="rounded-full w-8 h-8 flex items-center justify-center bg-white/50 hover:bg-white/80 transition-all duration-200 hover:scale-110 active:scale-95">
            <Plus size={16} />
          </button>
          <button onClick={() => onDelete(id)} className="rounded-full w-8 h-8 flex items-center justify-center bg-white/50 hover:bg-white/80 transition-all duration-200 hover:scale-110 active:scale-95">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-[100px]">
        <SortableContext items={tasks.map((t) => t.id)}>
          {tasks.map((task) => {
            const calculateLevel = (t: any, allTasks: any[]): number => {
              if (!t.parentId) return 0;
              const parent = allTasks.find(p => p.id === t.parentId);
              if (!parent) return 0;
              return 1 + calculateLevel(parent, allTasks);
            };
            const level = calculateLevel(task, tasks);

            return (
              <Task
                key={task.id}
                id={task.id}
                title={task.title}
                onClick={() => onTaskClick(task.id)}
                subtasksCount={task.children?.length || 0}
                level={level}
                priority={task.priority}
                assignees={task.assignees}
                links={task.links ? JSON.parse(task.links) : []}
                checklist={task.checklist ? JSON.parse(task.checklist) : []}
                cardColor={cardColor}
                progress={task.progress} // Pass progress
                onProgressChange={onProgressChange} // Pass handler
              />
            );
          })}
        </SortableContext>
      </div>
    </section>
  );
}