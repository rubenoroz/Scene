"use client";
import React, { useMemo, useState, useRef } from "react";

interface GanttTask {
    id: string;
    title: string;
    startDate?: string | null;
    endDate?: string | null;
    toleranceDate?: string | null;
    parentId?: string | null;
    children?: GanttTask[];
    projectId: string;
    columnId: string;
    isHiddenInGantt?: boolean;
}

interface GanttChartProps {
    tasks: GanttTask[];
    columns: { id: string; name: string; color?: string }[];
    onTaskClick: (taskId: string) => void;
    onTaskUpdate?: () => void;
    visibleTasks?: GanttTask[];
}

export function GanttChart({ tasks, columns, onTaskClick, onTaskUpdate, visibleTasks }: GanttChartProps) {
    const [resizing, setResizing] = useState<{ taskId: string; edge: 'start' | 'end' | 'tolerance'; newDate: string | null } | null>(null);
    const [previewDates, setPreviewDates] = useState<Record<string, { startDate?: string; endDate?: string; toleranceDate?: string }>>({});
    const timelineRef = useRef<HTMLDivElement>(null);
    const timelineTrackRef = useRef<HTMLDivElement>(null);

    // Filter out tasks that should be hidden in Gantt
    const ganttVisibleTasks = useMemo(() => {
        const sourceTasks = visibleTasks || tasks;
        return sourceTasks.filter(task => !task.isHiddenInGantt);
    }, [tasks, visibleTasks]);

    // Filter tasks that have dates
    const tasksWithDates = useMemo(() => {
        return ganttVisibleTasks.filter(task => task.startDate && task.endDate);
    }, [ganttVisibleTasks]);

    // Calculate date range for the project
    const dateRange = useMemo(() => {
        if (tasksWithDates.length === 0) {
            const today = new Date();
            return {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: new Date(today.getFullYear(), today.getMonth() + 3, 0),
            };
        }

        const dates = tasksWithDates.flatMap(task => [
            new Date(task.startDate!),
            new Date(task.endDate!),
            task.toleranceDate ? new Date(task.toleranceDate) : null,
        ].filter(Boolean) as Date[]);

        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

        // Add padding
        minDate.setDate(minDate.getDate() - 7);
        maxDate.setDate(maxDate.getDate() + 7);

        return { start: minDate, end: maxDate };
    }, [tasksWithDates]);

    // Generate month headers
    const months = useMemo(() => {
        const result: { label: string; days: number }[] = [];
        const current = new Date(dateRange.start);

        while (current <= dateRange.end) {
            const year = current.getFullYear();
            const month = current.getMonth();
            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 0);

            const daysInMonth = monthEnd.getDate();
            result.push({
                label: current.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                days: daysInMonth,
            });

            current.setMonth(current.getMonth() + 1);
        }

        return result;
    }, [dateRange]);

    const totalDays = useMemo(() => {
        return Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    }, [dateRange]);

    // Calculate task bar position and width with preview support
    const getTaskBarStyle = (task: GanttTask) => {
        if (!task.startDate || !task.endDate) return null;

        // Use preview dates if available
        const preview = previewDates[task.id];
        const startDate = preview?.startDate || task.startDate;
        const endDate = preview?.endDate || task.endDate;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const startOffset = Math.ceil((start.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const leftPercent = (startOffset / totalDays) * 100;
        const widthPercent = (duration / totalDays) * 100;

        return {
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
        };
    };

    // Convert mouse position to date
    const getDateFromMousePosition = (clientX: number) => {
        if (!timelineTrackRef.current) return null;

        const rect = timelineTrackRef.current.getBoundingClientRect();
        const relativeX = clientX - rect.left;
        const percentX = relativeX / rect.width;
        const dayOffset = Math.round(percentX * totalDays);

        const newDate = new Date(dateRange.start);
        newDate.setDate(newDate.getDate() + dayOffset);

        return newDate;
    };

    // Handle resize
    const handleMouseDown = (e: React.MouseEvent, taskId: string, edge: 'start' | 'end' | 'tolerance') => {
        e.stopPropagation();
        setResizing({ taskId, edge, newDate: null });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!resizing) return;

        const newDate = getDateFromMousePosition(e.clientX);
        if (!newDate) return;

        const task = tasksWithDates.find(t => t.id === resizing.taskId);
        if (!task) return;

        const dateString = newDate.toISOString().split('T')[0];

        // Validate dates based on edge being dragged
        if (resizing.edge === 'start' && task.endDate) {
            const endDate = new Date(task.endDate);
            if (newDate >= endDate) return;
        } else if (resizing.edge === 'end' && task.startDate) {
            const startDate = new Date(task.startDate);
            if (newDate <= startDate) return;
        }
        // No validation needed for tolerance date

        // Update preview dates for visual feedback
        const fieldName = resizing.edge === 'start' ? 'startDate' :
            resizing.edge === 'end' ? 'endDate' : 'toleranceDate';

        setPreviewDates(prev => ({
            ...prev,
            [resizing.taskId]: {
                ...prev[resizing.taskId],
                [fieldName]: dateString,
            }
        }));

        // Update the newDate in state
        setResizing({ ...resizing, newDate: dateString });
    };

    const handleMouseUp = async () => {
        if (!resizing || !resizing.newDate) {
            setResizing(null);
            setPreviewDates({});
            return;
        }

        const task = tasksWithDates.find(t => t.id === resizing.taskId);
        if (!task) {
            setResizing(null);
            setPreviewDates({});
            return;
        }

        // Determine field name based on edge
        const fieldName = resizing.edge === 'start' ? 'startDate' :
            resizing.edge === 'end' ? 'endDate' : 'toleranceDate';

        // Save to backend
        try {
            const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    [fieldName]: resizing.newDate,
                }),
            });

            if (response.ok) {
                // Refresh data without reloading the page
                setPreviewDates({});
                if (onTaskUpdate) {
                    onTaskUpdate();
                }
            }
        } catch (error) {
            console.error('Error updating task date:', error);
        }

        setResizing(null);
    };

    // Add event listeners
    React.useEffect(() => {
        if (resizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [resizing, previewDates]);

    // Flatten tasks with hierarchy info
    const flatTasks = useMemo(() => {
        const result: (GanttTask & { level: number })[] = [];
        const taskMap = new Map(tasksWithDates.map(t => [t.id, t]));
        const processedIds = new Set<string>();

        const flatten = (task: GanttTask, level: number) => {
            if (processedIds.has(task.id)) return;
            processedIds.add(task.id);

            result.push({ ...task, level });
            if (task.children) {
                task.children.forEach(childRef => {
                    const childTask = taskMap.get(childRef.id);
                    if (childTask) {
                        flatten(childTask, level + 1);
                    }
                });
            }
        };

        // Identify roots: tasks with no parent OR parent not in the map (orphaned)
        const roots = tasksWithDates.filter(task =>
            !task.parentId || !taskMap.has(task.parentId)
        );

        roots.forEach(task => flatten(task, 0));

        return result;
    }, [tasksWithDates]);

    if (tasksWithDates.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <div className="text-center p-8">
                    <p className="text-gray-500 text-lg mb-2">No hay tareas con fechas configuradas</p>
                    <p className="text-gray-400 text-sm">Agrega fechas de inicio y fin a tus tareas para verlas en el Gantt</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Timeline Header */}
            <div className="flex border-b border-gray-200 bg-gray-50">
                <div className="w-64 flex-shrink-0 p-4 font-semibold text-gray-700 border-r border-gray-200">
                    Tarea
                </div>
                <div className="flex-1 flex" ref={timelineTrackRef}>
                    {months.map((month, idx) => (
                        <div
                            key={idx}
                            className="flex-1 p-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
                            style={{ minWidth: `${(month.days / totalDays) * 100}%` }}
                        >
                            {month.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tasks */}
            <div className="flex-1 overflow-y-auto" ref={timelineRef}>
                {flatTasks.map((task) => {
                    const barStyle = getTaskBarStyle(task);
                    if (!barStyle) return null;

                    return (
                        <div
                            key={task.id}
                            className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                        >
                            {/* Task Name */}
                            <div
                                className="w-64 flex-shrink-0 p-3 border-r border-gray-200 flex items-center cursor-pointer"
                                onClick={() => onTaskClick(task.id)}
                                style={{ paddingLeft: `${task.level * 20 + 12}px` }}
                            >
                                {task.level > 0 && (
                                    <span className="text-gray-400 mr-2">└</span>
                                )}
                                <span className="text-sm text-gray-700 truncate hover:text-blue-600">
                                    {task.title}
                                </span>
                            </div>

                            {/* Timeline */}
                            <div className="flex-1 relative py-3 px-0">
                                {(() => {
                                    const column = columns.find(c => c.id === task.columnId);
                                    const columnColor = column?.color || '#E0F7FA';

                                    return (
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 h-8 rounded shadow-sm hover:opacity-90 transition-opacity group/bar"
                                            style={{ ...barStyle, backgroundColor: columnColor }}
                                            title={`${task.title}\n${new Date(task.startDate!).toLocaleDateString()} - ${new Date(task.endDate!).toLocaleDateString()}`}
                                        >
                                            {/* Left resize handle */}
                                            <div
                                                className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black hover:bg-opacity-20 opacity-0 group-hover/bar:opacity-100 transition-opacity"
                                                onMouseDown={(e) => handleMouseDown(e, task.id, 'start')}
                                                title="Arrastrar para cambiar fecha de inicio"
                                            />

                                            {/* Task title */}
                                            <div
                                                className="h-full flex items-center justify-center text-white text-xs font-medium px-2 truncate cursor-pointer"
                                                onClick={() => onTaskClick(task.id)}
                                            >
                                                {task.title}
                                            </div>

                                            {/* Right resize handle */}
                                            <div
                                                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black hover:bg-opacity-20 opacity-0 group-hover/bar:opacity-100 transition-opacity"
                                                onMouseDown={(e) => handleMouseDown(e, task.id, 'end')}
                                                title="Arrastrar para cambiar fecha de fin"
                                            />
                                        </div>
                                    );
                                })()}

                                {/* Tolerance Date Indicator */}
                                {task.toleranceDate && (
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-12 bg-red-500 opacity-70 hover:opacity-100 cursor-ew-resize transition-opacity group/tolerance"
                                        style={{
                                            left: `${((new Date(previewDates[task.id]?.toleranceDate || task.toleranceDate).getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100}%`,
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, task.id, 'tolerance')}
                                        title={`Fecha de tolerancia: ${new Date(previewDates[task.id]?.toleranceDate || task.toleranceDate).toLocaleDateString()}\nArrastrar para cambiar`}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-1 h-full bg-red-600" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
