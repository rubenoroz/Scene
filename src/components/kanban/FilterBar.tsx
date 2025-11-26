"use client";
import React, { useState, useEffect } from "react";
import { Filter, ChevronDown, X, Plus, Trash2 } from "lucide-react";
import { FilterBuilder, FilterCriteria } from "./FilterBuilder";

export type FilterType = "all" | "my-tasks" | "unassigned" | "overdue" | "this-week" | "custom";

interface FilterOption {
    id: FilterType | string;
    label: string;
    description: string;
    isCustom?: boolean;
}

interface SavedFilter {
    id: string;
    name: string;
    criteria: string;
    isDefault: boolean;
}

const PREDEFINED_FILTERS: FilterOption[] = [
    { id: "all", label: "Todas las Tareas", description: "Mostrar todas las tareas" },
    { id: "my-tasks", label: "Mis Tareas", description: "Tareas asignadas a mí" },
    { id: "unassigned", label: "Sin Asignar", description: "Tareas sin usuario asignado" },
    { id: "overdue", label: "Vencidas", description: "Tareas con fecha vencida" },
    { id: "this-week", label: "Esta Semana", description: "Vencen en los próximos 7 días" },
];

interface FilterBarProps {
    projectId: string;
    currentUserId: string;
    activeFilter: FilterType | string;
    onFilterChange: (filter: FilterType | string, criteria?: FilterCriteria) => void;
    availableUsers?: { id: string; name: string | null; email: string | null }[];
    availableColumns?: { id: string; name: string }[];
}

export function FilterBar({
    projectId,
    currentUserId,
    activeFilter,
    onFilterChange,
    availableUsers = [],
    availableColumns = []
}: FilterBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

    // Load saved filters
    useEffect(() => {
        fetch(`/api/projects/${projectId}/filters`)
            .then(res => res.json())
            .then(filters => setSavedFilters(filters))
            .catch(err => console.error("Error loading filters:", err));
    }, [projectId]);

    const handleSaveFilter = async (name: string, criteria: FilterCriteria) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/filters`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, criteria }),
            });

            if (response.ok) {
                const newFilter = await response.json();
                setSavedFilters([...savedFilters, newFilter]);
                onFilterChange(newFilter.id, criteria);
            }
        } catch (error) {
            console.error("Error saving filter:", error);
        }
    };

    const handleDeleteFilter = async (filterId: string) => {
        if (!confirm("¿Eliminar este filtro?")) return;

        try {
            const response = await fetch(`/api/projects/${projectId}/filters/${filterId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setSavedFilters(savedFilters.filter(f => f.id !== filterId));
                if (activeFilter === filterId) {
                    onFilterChange("all");
                }
            }
        } catch (error) {
            console.error("Error deleting filter:", error);
        }
    };

    const allFilters: FilterOption[] = [
        ...PREDEFINED_FILTERS,
        ...savedFilters.map(f => ({
            id: f.id,
            label: f.name,
            description: "Filtro personalizado",
            isCustom: true,
        })),
    ];

    const activeFilterLabel = allFilters.find(f => f.id === activeFilter)?.label || "Filtros";

    return (
        <>
            <div className="relative">
                {/* Filter Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Filter size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{activeFilterLabel}</span>
                    <ChevronDown size={16} className={`text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Active Filter Indicator */}
                {activeFilter !== "all" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                )}

                {/* Dropdown Menu */}
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu */}
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                                    Filtros Predefinidos
                                </div>
                                {PREDEFINED_FILTERS.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => {
                                            onFilterChange(filter.id as FilterType);
                                            setIsOpen(false);
                                        }}
                                        className={`
                      w-full text-left px-3 py-2 rounded-md transition-colors
                      ${activeFilter === filter.id
                                                ? "bg-blue-50 text-blue-700"
                                                : "hover:bg-gray-50 text-gray-700"
                                            }
                    `}
                                    >
                                        <div className="font-medium text-sm">{filter.label}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{filter.description}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Custom Filters */}
                            {savedFilters.length > 0 && (
                                <div className="border-t border-gray-200 p-2">
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                                        Filtros Personalizados
                                    </div>
                                    {savedFilters.map((filter) => (
                                        <div
                                            key={filter.id}
                                            className={`
                        flex items-center justify-between px-3 py-2 rounded-md transition-colors
                        ${activeFilter === filter.id
                                                    ? "bg-blue-50"
                                                    : "hover:bg-gray-50"
                                                }
                      `}
                                        >
                                            <button
                                                onClick={() => {
                                                    onFilterChange(filter.id, JSON.parse(filter.criteria));
                                                    setIsOpen(false);
                                                }}
                                                className="flex-1 text-left"
                                            >
                                                <div className="font-medium text-sm text-gray-700">{filter.name}</div>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteFilter(filter.id);
                                                }}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Create Filter Button */}
                            <div className="border-t border-gray-200 p-2">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsBuilderOpen(true);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium"
                                >
                                    <Plus size={16} />
                                    Crear Filtro Personalizado
                                </button>
                            </div>

                            {/* Clear Filter */}
                            {activeFilter !== "all" && (
                                <div className="border-t border-gray-200 p-2">
                                    <button
                                        onClick={() => {
                                            onFilterChange("all");
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                                    >
                                        <X size={14} />
                                        Limpiar Filtro
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Filter Builder Modal */}
            {isBuilderOpen && (
                <FilterBuilder
                    projectId={projectId}
                    availableUsers={availableUsers}
                    availableColumns={availableColumns}
                    onClose={() => setIsBuilderOpen(false)}
                    onSave={handleSaveFilter}
                />
            )}
        </>
    );
}
