"use client";
import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";

export interface FilterCondition {
    field: "assignee" | "priority" | "tags" | "dueDate" | "column" | "hasAttachments" | "checklistStatus";
    operator: "equals" | "contains" | "before" | "after" | "isEmpty" | "isNotEmpty";
    value: string | string[] | Date | boolean;
}

export interface FilterCriteria {
    conditions: FilterCondition[];
    operator: "AND" | "OR";
}

interface FilterBuilderProps {
    projectId: string;
    availableUsers: { id: string; name: string | null; email: string | null }[];
    availableColumns: { id: string; name: string }[];
    onClose: () => void;
    onSave: (name: string, criteria: FilterCriteria) => void;
}

const FIELD_OPTIONS = [
    { value: "assignee", label: "Asignado a" },
    { value: "priority", label: "Prioridad" },
    { value: "tags", label: "Etiquetas" },
    { value: "dueDate", label: "Fecha de vencimiento" },
    { value: "column", label: "Columna" },
    { value: "hasAttachments", label: "Tiene archivos" },
    { value: "checklistStatus", label: "Estado de checklist" },
];

const PRIORITY_OPTIONS = [
    { value: "LOW", label: "Baja" },
    { value: "MEDIUM", label: "Media" },
    { value: "HIGH", label: "Alta" },
    { value: "URGENT", label: "Urgente" },
];

export function FilterBuilder({
    projectId,
    availableUsers,
    availableColumns,
    onClose,
    onSave,
}: FilterBuilderProps) {
    const [mounted, setMounted] = useState(false);
    const [filterName, setFilterName] = useState("");
    const [operator, setOperator] = useState<"AND" | "OR">("AND");
    const [conditions, setConditions] = useState<FilterCondition[]>([
        { field: "assignee", operator: "equals", value: "" },
    ]);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const addCondition = () => {
        setConditions([
            ...conditions,
            { field: "assignee", operator: "equals", value: "" },
        ]);
    };

    const removeCondition = (index: number) => {
        setConditions(conditions.filter((_, i) => i !== index));
    };

    const updateCondition = (index: number, updates: Partial<FilterCondition>) => {
        const newConditions = [...conditions];
        newConditions[index] = { ...newConditions[index], ...updates };
        setConditions(newConditions);
    };

    const handleSave = () => {
        if (!filterName.trim()) {
            alert("Por favor ingresa un nombre para el filtro");
            return;
        }

        if (conditions.length === 0) {
            alert("Agrega al menos una condición");
            return;
        }

        onSave(filterName, { conditions, operator });
        onClose();
    };

    const renderValueInput = (condition: FilterCondition, index: number) => {
        switch (condition.field) {
            case "assignee":
                return (
                    <select
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                        value={condition.value as string}
                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                    >
                        <option value="">Seleccionar usuario...</option>
                        {availableUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name || user.email}
                            </option>
                        ))}
                    </select>
                );

            case "priority":
                return (
                    <select
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                        value={condition.value as string}
                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                    >
                        <option value="">Seleccionar prioridad...</option>
                        {PRIORITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case "column":
                return (
                    <select
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                        value={condition.value as string}
                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                    >
                        <option value="">Seleccionar columna...</option>
                        {availableColumns.map((col) => (
                            <option key={col.id} value={col.id}>
                                {col.name}
                            </option>
                        ))}
                    </select>
                );

            case "tags":
                return (
                    <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Nombre de etiqueta..."
                        value={condition.value as string}
                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                    />
                );

            case "dueDate":
                return (
                    <input
                        type="date"
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                        value={condition.value as string}
                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                    />
                );

            case "hasAttachments":
            case "checklistStatus":
                return (
                    <select
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                        value={condition.value as string}
                        onChange={(e) => updateCondition(index, { value: e.target.value === "true" })}
                    >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                );

            default:
                return null;
        }
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Crear Filtro Personalizado</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Filter Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Filtro
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Tareas Urgentes Sin Asignar"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </div>

                    {/* Operator */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Operador Lógico
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="operator"
                                    value="AND"
                                    checked={operator === "AND"}
                                    onChange={() => setOperator("AND")}
                                    className="text-blue-600"
                                />
                                <span className="text-sm">AND (todas las condiciones)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="operator"
                                    value="OR"
                                    checked={operator === "OR"}
                                    onChange={() => setOperator("OR")}
                                    className="text-blue-600"
                                />
                                <span className="text-sm">OR (cualquier condición)</span>
                            </label>
                        </div>
                    </div>

                    {/* Conditions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Condiciones
                        </label>
                        <div className="space-y-3">
                            {conditions.map((condition, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    {/* Field */}
                                    <select
                                        className="w-40 p-2 border border-gray-300 rounded-lg text-sm"
                                        value={condition.field}
                                        onChange={(e) =>
                                            updateCondition(index, {
                                                field: e.target.value as FilterCondition["field"],
                                                value: "",
                                            })
                                        }
                                    >
                                        {FIELD_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Operator */}
                                    <select
                                        className="w-32 p-2 border border-gray-300 rounded-lg text-sm"
                                        value={condition.operator}
                                        onChange={(e) =>
                                            updateCondition(index, {
                                                operator: e.target.value as FilterCondition["operator"],
                                            })
                                        }
                                    >
                                        <option value="equals">es igual a</option>
                                        <option value="contains">contiene</option>
                                        {condition.field === "dueDate" && (
                                            <>
                                                <option value="before">antes de</option>
                                                <option value="after">después de</option>
                                            </>
                                        )}
                                        <option value="isEmpty">está vacío</option>
                                        <option value="isNotEmpty">no está vacío</option>
                                    </select>

                                    {/* Value */}
                                    {condition.operator !== "isEmpty" && condition.operator !== "isNotEmpty" && (
                                        renderValueInput(condition, index)
                                    )}

                                    {/* Remove Button */}
                                    {conditions.length > 1 && (
                                        <button
                                            onClick={() => removeCondition(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Condition Button */}
                        <button
                            onClick={addCondition}
                            className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            Agregar Condición
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Guardar Filtro
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
