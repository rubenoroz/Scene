import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, Link2 } from "lucide-react";

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
      className={`card p-4 rounded-lg shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${isDragging ? "dragging shadow-2xl scale-105" : ""}`}
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

      <h3
        className="text-sm font-medium text-gray-800 truncate"
        title={title}
      >
        {title}
      </h3>

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
          <div
            className="w-full bg-gray-200 rounded-full h-1.5 cursor-pointer relative group transition-all duration-200 hover:h-2"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const width = rect.width;
              const newProgress = Math.round((x / width) * 100);
              // Clamp between 0 and 100
              const clampedProgress = Math.min(100, Math.max(0, newProgress));
              if (onProgressChange) onProgressChange(id, clampedProgress);
            }}
          >
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out group-hover:h-2"
              style={{ width: `${progress || 0}%` }}
            ></div>
            {/* Hover effect to show potential progress */}
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-full transition-all duration-300"></div>
          </div>
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
