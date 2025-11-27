import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, Link2, ChevronDown, ChevronRight, Eye, EyeOff, BarChart3 } from "lucide-react";

const PRIORITY_COLORS = {
  LOW: "#D1FAE5",
  MEDIUM: "#FEF3C7",
  HIGH: "#FED7AA",
  URGENT: "#FECACA",
};

const PRIORITY_LABELS = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export function Task({
  id,
  title,
  onClick,
  subtasksCount = 0,
  level = 0,
  priority,
  assignees = [],
  links = [],
  checklist = [],
  cardColor, // New prop
  progress, // New prop
  onProgressChange, // New prop
  isCollapsed = false, // New prop
  onToggleCollapse, // New prop
  isHidden = false, // New prop
  onToggleHide, // New prop
  isHiddenInGantt = false, // New prop
  onToggleGanttVisibility, // New prop
}: {
  id: string;
  title: string;
  onClick?: (taskId: string) => void;
  subtasksCount?: number;
  level?: number;
  priority?: string;
  assignees?: { id: string; name: string | null; email: string | null; image: string | null }[];
  links?: { title: string; url: string }[];
  checklist?: { id: string; text: string; completed: boolean }[];
  cardColor?: string; // New prop
  progress?: number; // New prop
  onProgressChange?: (taskId: string, newProgress: number) => void; // New prop
  isCollapsed?: boolean; // New prop
  onToggleCollapse?: (taskId: string) => void; // New prop
  isHidden?: boolean; // New prop
  onToggleHide?: (taskId: string) => void; // New prop
  isHiddenInGantt?: boolean; // New prop
  onToggleGanttVisibility?: (taskId: string) => void; // New prop
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "Task",
    },
  });

  const style = {
    transition: isDragging ? transition : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: CSS.Transform.toString(transform),
    marginLeft: level > 0 ? `${level * 20}px` : '0',
    backgroundColor: cardColor || '#FFFFFF',
    opacity: isDragging ? 0.5 : 1,
  };

  const completedChecklistItems = checklist.filter(item => item.completed).length;
  const totalChecklistItems = checklist.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick ? () => onClick(id) : undefined}
      className={`card p-4 rounded-lg shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group ${isDragging ? "dragging shadow-2xl scale-105" : ""}`}
    >
      {/* Priority Badge */}
      {priority && (
        <div
          className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS],
            color: '#1E293B'
          }}
        >
          {PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS]}
        </div>
      )}

      {/* Chevron button for tasks with subtasks */}
      <div className="flex items-center gap-2">
        {subtasksCount > 0 && onToggleCollapse && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(id);
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
            title={isCollapsed ? "Expandir subtareas" : "Colapsar subtareas"}
          >
            {isCollapsed ? (
              <ChevronRight size={16} className="text-gray-600" />
            ) : (
              <ChevronDown size={16} className="text-gray-600" />
            )}
          </button>
        )}

        {/* Hide Button */}
        {onToggleHide && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleHide(id);
            }}
            className={`p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 ${isHidden ? 'text-blue-600 opacity-100' : 'text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100'}`}
            title={isHidden ? "Mostrar tarea" : "Ocultar tarea temporalmente"}
          >
            {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {/* Gantt Visibility Button */}
        {onToggleGanttVisibility && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleGanttVisibility(id);
            }}
            className={`p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 ${isHiddenInGantt ? 'text-red-500 opacity-100' : 'text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100'}`}
            title={isHiddenInGantt ? "Mostrar en Gantt" : "Ocultar en Gantt"}
          >
            <BarChart3 size={16} className={isHiddenInGantt ? "opacity-50" : ""} />
          </button>
        )}

        <h3
          className="text-sm font-medium text-gray-800 truncate flex-1"
          title={title}
        >
          {title}
        </h3>
      </div>

      {/* Metadata Row */}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {/* Subtasks Count */}
        {subtasksCount > 0 && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <CheckSquare size={14} />
            <span>{subtasksCount}</span>
          </div>
        )}

        {/* Checklist Progress */}
        {totalChecklistItems > 0 && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <CheckSquare size={14} />
            <span>{completedChecklistItems}/{totalChecklistItems}</span>
          </div>
        )}

        {/* Links Indicator */}
        {links.length > 0 && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Link2 size={14} />
            <span>{links.length}</span>
          </div>
        )}

        {/* Assignee Avatars */}
        {assignees.length > 0 && (
          <div className="flex -space-x-2 ml-auto">
            {assignees.slice(0, 3).map((assignee) => (
              assignee.image ? (
                <img
                  key={assignee.id}
                  src={assignee.image}
                  alt={assignee.name || assignee.email || "User"}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  title={assignee.name || assignee.email || ""}
                />
              ) : (
                <div
                  key={assignee.id}
                  className="w-6 h-6 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-900"
                  title={assignee.name || assignee.email || ""}
                >
                  {(assignee.name || assignee.email || "?")[0].toUpperCase()}
                </div>
              )
            ))}
            {assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700">
                +{assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar and Complete Button */}
      <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progreso</span>
            <span>{progress || 0}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={progress || 0}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag conflict with dnd-kit
            onChange={(e) => {
              const newProgress = parseInt(e.target.value, 10);
              if (onProgressChange) onProgressChange(id, newProgress);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600 transition-all"
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onProgressChange) onProgressChange(id, 100);
          }}
          className={`p-1 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${progress === 100
            ? "text-green-600 bg-green-100 hover:bg-green-200 shadow-sm"
            : "text-gray-400 hover:text-green-600 hover:bg-gray-100"
            }`}
          title="Marcar como completada"
        >
          <CheckSquare size={16} className="transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
