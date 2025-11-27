import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { X } from 'lucide-react';

interface ProjectStatisticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: any[];
}

const COLORS = {
    completed: '#22c55e', // green-500
    inProgress: '#3b82f6', // blue-500
    notStarted: '#94a3b8', // slate-400
};

export function ProjectStatisticsModal({ isOpen, onClose, tasks }: ProjectStatisticsModalProps) {
    if (!isOpen) return null;

    // Filter for subtasks (tasks that have a parentId)
    const subtasks = tasks.filter(task => task.parentId);
    const totalSubtasks = subtasks.length;

    if (totalSubtasks === 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
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

    // Calculate stats
    const completed = subtasks.filter(t => (t.progress || 0) === 100).length;
    const notStarted = subtasks.filter(t => (t.progress || 0) === 0).length;
    const inProgress = totalSubtasks - completed - notStarted;

    const data = [
        { name: 'Completadas', value: completed, color: COLORS.completed },
        { name: 'En Progreso', value: inProgress, color: COLORS.inProgress },
        { name: 'Sin Iniciar', value: notStarted, color: COLORS.notStarted },
    ].filter(item => item.value > 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-in fade-in zoom-in duration-200"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-6">Progreso de Subtareas</h2>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Chart */}
                    <div className="w-full md:w-1/2 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [`${value} tareas`, 'Cantidad']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend & Stats */}
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Total de Subtareas</p>
                            <p className="text-3xl font-bold text-gray-800">{totalSubtasks}</p>
                        </div>

                        <div className="space-y-3">
                            {data.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-800">{item.value}</span>
                                        <span className="text-xs text-gray-500 w-12 text-right">
                                            {Math.round((item.value / totalSubtasks) * 100)}%
                                        </span>
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
