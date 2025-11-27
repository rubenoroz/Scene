import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { X, List, CheckCircle2, BarChart3 } from 'lucide-react';

interface ProjectStatisticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: any[];
    columns?: any[];
}

const COLORS = {
    completed: '#22c55e', // green-500
    inProgress: '#3b82f6', // blue-500
    notStarted: '#94a3b8', // slate-400
};

export function ProjectStatisticsModal({ isOpen, onClose, tasks, columns = [] }: ProjectStatisticsModalProps) {
    const [viewMode, setViewMode] = useState<'status' | 'list_distribution' | 'list_performance'>('status');

    if (!isOpen) return null;

    // Filter for subtasks (tasks that have a parentId)
    const subtasks = tasks.filter(task => task.parentId);
    const totalSubtasks = subtasks.length;

    if (totalSubtasks === 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Estadísticas del Proyecto</h2>
                    <p className="text-gray-500 text-center py-8">No hay subtareas para analizar aún.</p>
                </div>
            </div>
        );
    }

    // --- Data Preparation ---

    // 1. By Status
    const completed = subtasks.filter(t => (t.progress || 0) === 100).length;
    const notStarted = subtasks.filter(t => (t.progress || 0) === 0).length;
    const inProgress = totalSubtasks - completed - notStarted;

    const dataByStatus = [
        { name: 'Completadas', value: completed, color: COLORS.completed },
        { name: 'En Progreso', value: inProgress, color: COLORS.inProgress },
        { name: 'Sin Iniciar', value: notStarted, color: COLORS.notStarted },
    ].filter(item => item.value > 0);

    // 2. By List (Column) - Distribution & Performance
    const dataByList = columns.map(col => {
        const tasksInCol = subtasks.filter(t => t.columnId === col.id);
        const count = tasksInCol.length;

        // Calculate average progress
        const totalProgress = tasksInCol.reduce((sum, t) => sum + (t.progress || 0), 0);
        const avgProgress = count > 0 ? Math.round(totalProgress / count) : 0;

        return {
            name: col.name,
            value: count, // For Pie Chart
            avgProgress: avgProgress, // For Bar Chart
            color: col.color || '#cbd5e1',
            taskCount: count
        };
    }).filter(item => viewMode === 'list_performance' ? true : item.value > 0); // Keep all columns for bar chart, filter empty for pie

    const activeData = viewMode === 'status' ? dataByStatus : dataByList;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative animate-in fade-in zoom-in duration-200"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pr-8 gap-4">
                    <h2 className="text-xl font-bold text-gray-800">Progreso de Subtareas</h2>

                    {/* View Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-full">
                        <button
                            onClick={() => setViewMode('status')}
                            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'status'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <CheckCircle2 size={16} />
                            Por Estado
                        </button>
                        <button
                            onClick={() => setViewMode('list_distribution')}
                            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'list_distribution'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <List size={16} />
                            Por Lista
                        </button>
                        <button
                            onClick={() => setViewMode('list_performance')}
                            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'list_performance'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <BarChart3 size={16} />
                            Rendimiento
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Chart Area */}
                    <div className="w-full md:w-3/5 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            {viewMode === 'list_performance' ? (
                                <BarChart data={activeData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" domain={[0, 100]} unit="%" />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value: number) => [`${value}%`, 'Avance Promedio']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="avgProgress" radius={[0, 4, 4, 0]}>
                                        {activeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={activeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {activeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number, name: string, props: any) => {
                                            if (viewMode === 'list_distribution') {
                                                return [
                                                    `${value} tareas`,
                                                    name
                                                ];
                                            }
                                            return [`${value} tareas`, name];
                                        }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>

                    {/* Stats Summary Panel */}
                    <div className="w-full md:w-2/5 space-y-4 max-h-72 overflow-y-auto pr-2">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Total de Subtareas</p>
                            <p className="text-3xl font-bold text-gray-800">{totalSubtasks}</p>
                        </div>

                        <div className="space-y-3">
                            {activeData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm font-medium text-gray-700 truncate" title={item.name}>{item.name}</span>
                                    </div>

                                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                        {viewMode === 'list_performance' ? (
                                            <span className="text-sm font-bold text-gray-800">{(item as any).avgProgress}%</span>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-800">{item.value}</span>
                                                    <span className="text-xs text-gray-500 w-10 text-right">
                                                        {Math.round((item.value / totalSubtasks) * 100)}%
                                                    </span>
                                                </div>
                                                {viewMode === 'list_distribution' && (
                                                    <span className="text-[10px] text-gray-400">
                                                        Avg: {(item as any).avgProgress}%
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
