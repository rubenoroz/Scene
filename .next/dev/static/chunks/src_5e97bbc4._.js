(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/kanban/Task.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Task",
    ()=>Task
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/utilities/dist/utilities.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const PASTEL_COLORS = [
    "#E0F7FA",
    "#F1F8E9",
    "#FFF8E1",
    "#F3E5F5",
    "#E3F2FD",
    "#FBE9E7",
    "#FFF3E0",
    "#E8F5E9",
    "#FCE4EC",
    "#E1F5FE"
];
const PRIORITY_COLORS = {
    LOW: "#D1FAE5",
    MEDIUM: "#FEF3C7",
    HIGH: "#FED7AA",
    URGENT: "#FECACA"
};
const PRIORITY_LABELS = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    URGENT: "Urgente"
};
function getTaskColor(id) {
    let hash = 0;
    for(let i = 0; i < id.length; i++){
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PASTEL_COLORS.length;
    return PASTEL_COLORS[index];
}
function Task({ id, title, isActive, className, onClick, subtasksCount = 0, isSubtask = false, parentId, level = 0, priority, assignees = [], links = [], checklist = [] }) {
    _s();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"])({
        id,
        data: {
            type: "Task"
        }
    });
    const colorSeed = parentId || id;
    const backgroundColor = getTaskColor(colorSeed);
    const style = {
        transition,
        transform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSS"].Transform.toString(transform),
        marginLeft: level > 0 ? `${level * 20}px` : '0',
        backgroundColor: isActive ? undefined : backgroundColor
    };
    const completedChecklistItems = checklist.filter((item)=>item.completed).length;
    const totalChecklistItems = checklist.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: setNodeRef,
        style: style,
        ...attributes,
        ...listeners,
        onClick: onClick ? ()=>onClick(id) : undefined,
        className: `card ${isActive ? "active" : ""} ${isDragging ? "dragging" : ""} ${className || ""} `,
        children: [
            priority && priority !== "MEDIUM" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "inline-block px-2 py-0.5 rounded text-xs font-medium mb-2",
                style: {
                    backgroundColor: PRIORITY_COLORS[priority],
                    color: '#1E293B'
                },
                children: PRIORITY_LABELS[priority]
            }, void 0, false, {
                fileName: "[project]/src/components/kanban/Task.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                style: {
                    color: 'black !important'
                },
                className: "truncate overflow-hidden text-ellipsis",
                title: title,
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/kanban/Task.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mt-2 flex-wrap",
                children: [
                    subtasksCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500 flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/Task.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: subtasksCount
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/Task.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/kanban/Task.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this),
                    totalChecklistItems > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500 flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/Task.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    completedChecklistItems,
                                    "/",
                                    totalChecklistItems
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/kanban/Task.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/kanban/Task.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this),
                    links.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500 flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/Task.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: links.length
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/Task.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/kanban/Task.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this),
                    assignees.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex -space-x-2 ml-auto",
                        children: [
                            assignees.slice(0, 3).map((assignee)=>assignee.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: assignee.image,
                                    alt: assignee.name || assignee.email || "User",
                                    className: "w-6 h-6 rounded-full border-2 border-white",
                                    title: assignee.name || assignee.email || ""
                                }, assignee.id, false, {
                                    fileName: "[project]/src/components/kanban/Task.tsx",
                                    lineNumber: 159,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-6 h-6 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-900",
                                    title: assignee.name || assignee.email || "",
                                    children: (assignee.name || assignee.email || "?")[0].toUpperCase()
                                }, assignee.id, false, {
                                    fileName: "[project]/src/components/kanban/Task.tsx",
                                    lineNumber: 167,
                                    columnNumber: 17
                                }, this)),
                            assignees.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700",
                                children: [
                                    "+",
                                    assignees.length - 3
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/kanban/Task.tsx",
                                lineNumber: 177,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/kanban/Task.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/kanban/Task.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/kanban/Task.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s(Task, "iTIyvp0X9kMGpdHRsWsr2+tGbVI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"]
    ];
});
_c = Task;
var _c;
__turbopack_context__.k.register(_c, "Task");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/kanban/Column.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Column",
    ()=>Column
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/core/dist/core.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/utilities/dist/utilities.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$kanban$2f$Task$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/kanban/Task.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVertical>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function Column({ id, title, tasks, onEditName, onDelete, onCreateTask, onTaskClick }) {
    _s();
    const { setNodeRef: setDroppableNodeRef } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDroppable"])({
        id,
        data: {
            type: "Column"
        }
    });
    const { setNodeRef: setSortableNodeRef, attributes, listeners, transform, transition, isDragging } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"])({
        id: id,
        data: {
            type: "Column"
        }
    });
    const style = {
        transition,
        transform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSS"].Transform.toString(transform)
    };
    const [isEditingTitle, setIsEditingTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newTitle, setNewTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(title);
    const handleTitleDoubleClick = ()=>{
        setIsEditingTitle(true);
    };
    const handleTitleChange = (e)=>{
        setNewTitle(e.target.value);
    };
    const handleTitleBlur = ()=>{
        if (newTitle.trim() !== title) {
            onEditName(id, newTitle.trim());
        }
        setIsEditingTitle(false);
    };
    const handleTitleKeyDown = (e)=>{
        if (e.key === "Enter") {
            handleTitleBlur();
        }
        if (e.key === "Escape") {
            setNewTitle(title);
            setIsEditingTitle(false);
        }
    };
    const handleAddTask = ()=>{
        onCreateTask(id); // Call the prop with the column's ID
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: (node)=>{
            setDroppableNodeRef(node);
            setSortableNodeRef(node);
        },
        style: style,
        ...attributes,
        className: `column flex-shrink-0 ${isDragging ? "dragging" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-1",
                children: [
                    isEditingTitle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: newTitle,
                        onChange: handleTitleChange,
                        onBlur: handleTitleBlur,
                        onKeyDown: handleTitleKeyDown,
                        className: "column-title-edit",
                        autoFocus: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/kanban/Column.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "column-title",
                        onDoubleClick: handleTitleDoubleClick,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/kanban/Column.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAddTask,
                                className: "rounded-full w-8 h-8 flex items-center justify-center bg-[#2563EB] hover:bg-[#3B82F6]",
                                style: {
                                    borderWidth: '1px',
                                    borderColor: 'white',
                                    borderStyle: 'solid'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    size: 16,
                                    stroke: "white",
                                    fill: "white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/Column.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/Column.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onDelete(id),
                                className: "rounded-full w-8 h-8 flex items-center justify-center bg-[#EF4444] hover:bg-[#DC2626]",
                                style: {
                                    borderWidth: '1px',
                                    borderColor: 'white',
                                    borderStyle: 'solid'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 16,
                                    stroke: "white",
                                    fill: "white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/Column.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/Column.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ...listeners,
                                className: "rounded-full w-8 h-8 flex items-center justify-center bg-[#FACC15] hover:bg-[#EAB308] cursor-grab",
                                style: {
                                    borderWidth: '1px',
                                    borderColor: 'white',
                                    borderStyle: 'solid'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                                    size: 16,
                                    stroke: "white",
                                    fill: "white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/Column.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/Column.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/kanban/Column.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/kanban/Column.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-[12px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SortableContext"], {
                    items: tasks.map((t)=>t.id),
                    children: tasks.map((task)=>{
                        // Calculate the depth level of this task
                        const calculateLevel = (t, allTasks)=>{
                            if (!t.parentId) return 0;
                            const parent = allTasks.find((p)=>p.id === t.parentId);
                            if (!parent) return 0;
                            return 1 + calculateLevel(parent, allTasks);
                        };
                        const level = calculateLevel(task, tasks);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$kanban$2f$Task$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Task"], {
                            id: task.id,
                            title: task.title,
                            isActive: task.isActive,
                            onClick: onTaskClick,
                            subtasksCount: task.children?.length || 0,
                            isSubtask: !!task.parentId,
                            parentId: task.parentId,
                            level: level,
                            priority: task.priority || undefined,
                            assignees: task.assignees || [],
                            links: task.links ? JSON.parse(task.links) : [],
                            checklist: task.checklist ? JSON.parse(task.checklist) : []
                        }, task.id, false, {
                            fileName: "[project]/src/components/kanban/Column.tsx",
                            lineNumber: 127,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/components/kanban/Column.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/kanban/Column.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/kanban/Column.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(Column, "TW46eDVnqR53mT2ryo0B7nQPATc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDroppable"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"]
    ];
});
_c = Column;
var _c;
__turbopack_context__.k.register(_c, "Column");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            shiny: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-lg px-3",
            lg: "h-11 rounded-lg px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 48,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/kanban/TaskDetailModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TaskDetailModal",
    ()=>TaskDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function TaskDetailModal({ task, onClose, onTaskUpdate }) {
    _s();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [dragStart, setDragStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [subtaskTitle, setSubtaskTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isAddingSubtask, setIsAddingSubtask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Rich fields state
    const [priority, setPriority] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task?.priority || "MEDIUM");
    const [tags, setTags] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task?.tags ? JSON.parse(task.tags) : []);
    const [links, setLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task?.links ? JSON.parse(task.links) : []);
    const [checklist, setChecklist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task?.checklist ? JSON.parse(task.checklist) : []);
    const [attachments, setAttachments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task?.attachments ? JSON.parse(task.attachments) : []);
    const [newTagName, setNewTagName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [newLinkTitle, setNewLinkTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [newLinkUrl, setNewLinkUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [newChecklistItem, setNewChecklistItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // User assignment state
    const [availableUsers, setAvailableUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedAssignees, setSelectedAssignees] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task?.assignees?.map({
        "TaskDetailModal.useState": (a)=>a.id
    }["TaskDetailModal.useState"]) || []);
    // Sync selectedAssignees when task.assignees changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskDetailModal.useEffect": ()=>{
            if (task?.assignees) {
                setSelectedAssignees(task.assignees.map({
                    "TaskDetailModal.useEffect": (a)=>a.id
                }["TaskDetailModal.useEffect"]));
            }
        }
    }["TaskDetailModal.useEffect"], [
        task?.assignees
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskDetailModal.useEffect": ()=>{
            setMounted(true);
            // Set initial centered position
            if ("TURBOPACK compile-time truthy", 1) {
                setPosition({
                    x: (window.innerWidth - 560) / 2,
                    y: (window.innerHeight - 600) / 2 // Center vertically (assuming ~600px modal height)
                });
            }
            return ({
                "TaskDetailModal.useEffect": ()=>setMounted(false)
            })["TaskDetailModal.useEffect"];
        }
    }["TaskDetailModal.useEffect"], []);
    // The handleMouseDown, handleMouseMove, handleMouseUp, and their useEffect
    // have been updated to reflect the new dragging logic using dragStart
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TaskDetailModal.useCallback[handleMouseDown]": (e)=>{
            setIsDragging(true);
            // Calculate offset based on current state position
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    }["TaskDetailModal.useCallback[handleMouseDown]"], [
        position
    ]);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TaskDetailModal.useCallback[handleMouseMove]": (e)=>{
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y
                });
            }
        }
    }["TaskDetailModal.useCallback[handleMouseMove]"], [
        isDragging,
        dragStart
    ]);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TaskDetailModal.useCallback[handleMouseUp]": ()=>{
            setIsDragging(false);
        }
    }["TaskDetailModal.useCallback[handleMouseUp]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskDetailModal.useEffect": ()=>{
            if (isDragging) {
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
            } else {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            }
            return ({
                "TaskDetailModal.useEffect": ()=>{
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                }
            })["TaskDetailModal.useEffect"];
        }
    }["TaskDetailModal.useEffect"], [
        isDragging,
        handleMouseMove,
        handleMouseUp
    ]);
    // Fetch available users for assignment
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskDetailModal.useEffect": ()=>{
            if (task?.projectId) {
                fetch(`/api/projects/${task.projectId}/users`).then({
                    "TaskDetailModal.useEffect": (res)=>res.json()
                }["TaskDetailModal.useEffect"]).then({
                    "TaskDetailModal.useEffect": (users)=>setAvailableUsers(users)
                }["TaskDetailModal.useEffect"]).catch({
                    "TaskDetailModal.useEffect": (err)=>console.error("Error fetching users:", err)
                }["TaskDetailModal.useEffect"]);
            }
        }
    }["TaskDetailModal.useEffect"], [
        task?.projectId
    ]);
    const handleAddSubtask = async ()=>{
        if (!subtaskTitle.trim() || !task) return;
        setIsAddingSubtask(true);
        try {
            const response = await fetch(`/api/projects/${task.projectId}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: subtaskTitle,
                    columnId: task.columnId,
                    parentId: task.id
                })
            });
            if (response.ok) {
                setSubtaskTitle("");
                onTaskUpdate(); // Refresh data via parent callback
            } else {
                console.error("Failed to create subtask");
            }
        } catch (error) {
            console.error("Error creating subtask:", error);
        } finally{
            setIsAddingSubtask(false);
        }
    };
    if (!task || !mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-gray-600 bg-opacity-75 z-50",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: modalRef,
            className: "task-detail-modal",
            style: {
                position: 'fixed',
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                minWidth: '320px',
                maxWidth: '560px'
            },
            onMouseDown: handleMouseDown,
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-header flex justify-between items-center pb-4 border-b border-gray-200 mb-6 cursor-move -mt-[10px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-[#0F172A]",
                            children: task.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 195,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "modal-close-btn",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 16,
                                stroke: "white",
                                fill: "white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 196,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                    lineNumber: 194,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-body overflow-y-auto max-h-[60vh] space-y-6 mt-[5px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2",
                                    children: "Description"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-700 leading-loose",
                                    children: task.description || "No description provided."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 204,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-[5px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3",
                                    children: "Fechas"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 211,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Fecha de inicio"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    className: "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]",
                                                    value: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
                                                    onChange: async (e)=>{
                                                        const newDate = e.target.value || null;
                                                        try {
                                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                body: JSON.stringify({
                                                                    startDate: newDate
                                                                })
                                                            });
                                                            onTaskUpdate();
                                                        } catch (error) {
                                                            console.error("Error updating start date:", error);
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 213,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Fecha de finalización"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    className: "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]",
                                                    value: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : '',
                                                    onChange: async (e)=>{
                                                        const newDate = e.target.value || null;
                                                        try {
                                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                body: JSON.stringify({
                                                                    endDate: newDate
                                                                })
                                                            });
                                                            onTaskUpdate();
                                                        } catch (error) {
                                                            console.error("Error updating end date:", error);
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 234,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Fecha de tolerancia"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    className: "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]",
                                                    value: task.toleranceDate ? new Date(task.toleranceDate).toISOString().split('T')[0] : '',
                                                    onChange: async (e)=>{
                                                        const newDate = e.target.value || null;
                                                        try {
                                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                body: JSON.stringify({
                                                                    toleranceDate: newDate
                                                                })
                                                            });
                                                            onTaskUpdate();
                                                        } catch (error) {
                                                            console.error("Error updating tolerance date:", error);
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 255,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 212,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 210,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-[5px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3",
                                    children: "Prioridad"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 281,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
                                    value: priority,
                                    onChange: async (e)=>{
                                        const newPriority = e.target.value;
                                        setPriority(newPriority);
                                        try {
                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                method: "PUT",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    priority: newPriority
                                                })
                                            });
                                            onTaskUpdate();
                                        } catch (error) {
                                            console.error("Error updating priority:", error);
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "LOW",
                                            children: "Baja"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 300,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "MEDIUM",
                                            children: "Media"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 301,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "HIGH",
                                            children: "Alta"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 302,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "URGENT",
                                            children: "Urgente"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 303,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 280,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-[5px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3",
                                    children: "Asignado a"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 309,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2 mb-3",
                                    children: selectedAssignees.map((assigneeId)=>{
                                        const assignee = availableUsers.find((u)=>u.id === assigneeId) || task?.assignees?.find((a)=>a.id === assigneeId);
                                        if (!assignee) return null;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full",
                                            children: [
                                                assignee.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: assignee.image,
                                                    alt: assignee.name || assignee.email || "User",
                                                    className: "w-6 h-6 rounded-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium text-neutral-900",
                                                    children: (assignee.name || assignee.email || "?")[0].toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm text-gray-700",
                                                    children: assignee.name || assignee.email
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 332,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "text-gray-600 hover:text-red-600",
                                                    onClick: async ()=>{
                                                        const newAssignees = selectedAssignees.filter((id)=>id !== assignee.id);
                                                        setSelectedAssignees(newAssignees);
                                                        try {
                                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                body: JSON.stringify({
                                                                    assignees: newAssignees
                                                                })
                                                            });
                                                            onTaskUpdate();
                                                        } catch (error) {
                                                            console.error("Error removing assignee:", error);
                                                        }
                                                    },
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, assignee.id, true, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 317,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 310,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
                                    value: "",
                                    onChange: async (e)=>{
                                        const userId = e.target.value;
                                        console.log("Selected user ID:", userId);
                                        console.log("Current selectedAssignees:", selectedAssignees);
                                        if (!userId || selectedAssignees.includes(userId)) return;
                                        const newAssignees = [
                                            ...selectedAssignees,
                                            userId
                                        ];
                                        console.log("New assignees array:", newAssignees);
                                        try {
                                            const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                method: "PUT",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    assignees: newAssignees
                                                })
                                            });
                                            if (response.ok) {
                                                const updatedTask = await response.json();
                                                console.log("Updated task from API:", updatedTask);
                                                console.log("Assignees in response:", updatedTask.assignees);
                                                // Update local state with the response
                                                if (updatedTask.assignees) {
                                                    const newIds = updatedTask.assignees.map((a)=>a.id);
                                                    console.log("Setting selectedAssignees to:", newIds);
                                                    setSelectedAssignees(newIds);
                                                }
                                                // Refresh the board to update the task in the parent component
                                                await onTaskUpdate();
                                            // Force a re-fetch of the task to update the modal
                                            // The parent will update and the modal will receive new props
                                            } else {
                                                console.error("Response not OK:", response.status);
                                            }
                                        } catch (error) {
                                            console.error("Error adding assignee:", error);
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Agregar usuario..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 401,
                                            columnNumber: 15
                                        }, this),
                                        availableUsers.filter((user)=>!selectedAssignees.includes(user.id)).map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: user.id,
                                                children: user.name || user.email
                                            }, user.id, false, {
                                                fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                lineNumber: 405,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 356,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 308,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-[5px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3",
                                    children: "Etiquetas"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 414,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2 mb-3",
                                    children: tags.map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "px-3 py-1 rounded-full text-sm font-medium",
                                            style: {
                                                backgroundColor: tag.color || '#E0E7FF',
                                                color: '#1E293B'
                                            },
                                            children: [
                                                tag.name,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "ml-2 text-gray-600 hover:text-red-600",
                                                    onClick: async ()=>{
                                                        const newTags = tags.filter((_, i)=>i !== index);
                                                        setTags(newTags);
                                                        try {
                                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                body: JSON.stringify({
                                                                    tags: newTags
                                                                })
                                                            });
                                                            onTaskUpdate();
                                                        } catch (error) {
                                                            console.error("Error removing tag:", error);
                                                        }
                                                    },
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 417,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 415,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Nueva etiqueta",
                                            className: "flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
                                            value: newTagName,
                                            onChange: (e)=>setNewTagName(e.target.value),
                                            onKeyPress: (e)=>{
                                                if (e.key === 'Enter' && newTagName.trim()) {
                                                    const colors = [
                                                        '#E0E7FF',
                                                        '#FEF3C7',
                                                        '#D1FAE5',
                                                        '#FCE7F3',
                                                        '#E0F2FE'
                                                    ];
                                                    const newTag = {
                                                        name: newTagName.trim(),
                                                        color: colors[tags.length % colors.length]
                                                    };
                                                    const newTags = [
                                                        ...tags,
                                                        newTag
                                                    ];
                                                    setTags(newTags);
                                                    setNewTagName("");
                                                    fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                        method: "PUT",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            tags: newTags
                                                        })
                                                    }).then(()=>onTaskUpdate());
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 446,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "px-4 py-2 bg-blue-200 text-neutral-900 rounded-lg hover:bg-blue-300 transition-colors font-medium",
                                            onClick: async ()=>{
                                                if (!newTagName.trim()) return;
                                                const colors = [
                                                    '#E0E7FF',
                                                    '#FEF3C7',
                                                    '#D1FAE5',
                                                    '#FCE7F3',
                                                    '#E0F2FE'
                                                ];
                                                const newTag = {
                                                    name: newTagName.trim(),
                                                    color: colors[tags.length % colors.length]
                                                };
                                                const newTags = [
                                                    ...tags,
                                                    newTag
                                                ];
                                                setTags(newTags);
                                                setNewTagName("");
                                                try {
                                                    await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                        method: "PUT",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            tags: newTags
                                                        })
                                                    });
                                                    onTaskUpdate();
                                                } catch (error) {
                                                    console.error("Error adding tag:", error);
                                                }
                                            },
                                            children: "Agregar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 467,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 445,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 413,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-[5px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3",
                                    children: "Enlaces"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 495,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 mb-3",
                                    children: links.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between p-2 bg-gray-50 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: link.url,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "text-blue-600 hover:underline flex-1 truncate",
                                                    children: link.title || link.url
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 499,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "ml-2 text-gray-600 hover:text-red-600",
                                                    onClick: async ()=>{
                                                        const newLinks = links.filter((_, i)=>i !== index);
                                                        setLinks(newLinks);
                                                        try {
                                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                body: JSON.stringify({
                                                                    links: newLinks
                                                                })
                                                            });
                                                            onTaskUpdate();
                                                        } catch (error) {
                                                            console.error("Error removing link:", error);
                                                        }
                                                    },
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 498,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 496,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Título del enlace",
                                            className: "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
                                            value: newLinkTitle,
                                            onChange: (e)=>setNewLinkTitle(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 530,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "url",
                                                    placeholder: "https://ejemplo.com",
                                                    className: "flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
                                                    value: newLinkUrl,
                                                    onChange: (e)=>setNewLinkUrl(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "px-4 py-2 bg-blue-200 text-neutral-900 rounded-lg hover:bg-blue-300 transition-colors font-medium",
                                                    onClick: async ()=>{
                                                        if (!newLinkUrl.trim()) return;
                                                        const newLink = {
                                                            title: newLinkTitle.trim() || newLinkUrl,
                                                            url: newLinkUrl.trim()
                                                        };
                                                        const newLinks = [
                                                            ...links,
                                                            newLink
                                                        ];
                                                        setLinks(newLinks);
                                                        setNewLinkTitle("");
                                                        setNewLinkUrl("");
                                                        try {
                                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                body: JSON.stringify({
                                                                    links: newLinks
                                                                })
                                                            });
                                                            onTaskUpdate();
                                                        } catch (error) {
                                                            console.error("Error adding link:", error);
                                                        }
                                                    },
                                                    children: "Agregar"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 545,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 537,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 529,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 494,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-[5px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3",
                                    children: "Checklist"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 574,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 mb-3",
                                    children: checklist.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: item.completed,
                                                    className: "w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600",
                                                    onChange: async (e)=>{
                                                        const newChecklist = checklist.map((i)=>i.id === item.id ? {
                                                                ...i,
                                                                completed: e.target.checked
                                                            } : i);
                                                        setChecklist(newChecklist);
                                                        try {
                                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                body: JSON.stringify({
                                                                    checklist: newChecklist
                                                                })
                                                            });
                                                            onTaskUpdate();
                                                        } catch (error) {
                                                            console.error("Error updating checklist:", error);
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 578,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`,
                                                    children: item.text
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "text-gray-600 hover:text-red-600",
                                                    onClick: async ()=>{
                                                        const newChecklist = checklist.filter((i)=>i.id !== item.id);
                                                        setChecklist(newChecklist);
                                                        try {
                                                            await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                },
                                                                body: JSON.stringify({
                                                                    checklist: newChecklist
                                                                })
                                                            });
                                                            onTaskUpdate();
                                                        } catch (error) {
                                                            console.error("Error removing checklist item:", error);
                                                        }
                                                    },
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 577,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 575,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Nuevo item",
                                            className: "flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
                                            value: newChecklistItem,
                                            onChange: (e)=>setNewChecklistItem(e.target.value),
                                            onKeyPress: (e)=>{
                                                if (e.key === 'Enter' && newChecklistItem.trim()) {
                                                    const newItem = {
                                                        id: Date.now().toString(),
                                                        text: newChecklistItem.trim(),
                                                        completed: false
                                                    };
                                                    const newChecklist = [
                                                        ...checklist,
                                                        newItem
                                                    ];
                                                    setChecklist(newChecklist);
                                                    setNewChecklistItem("");
                                                    fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                        method: "PUT",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            checklist: newChecklist
                                                        })
                                                    }).then(()=>onTaskUpdate());
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 625,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "px-4 py-2 bg-blue-200 text-neutral-900 rounded-lg hover:bg-blue-300 transition-colors font-medium",
                                            onClick: async ()=>{
                                                if (!newChecklistItem.trim()) return;
                                                const newItem = {
                                                    id: Date.now().toString(),
                                                    text: newChecklistItem.trim(),
                                                    completed: false
                                                };
                                                const newChecklist = [
                                                    ...checklist,
                                                    newItem
                                                ];
                                                setChecklist(newChecklist);
                                                setNewChecklistItem("");
                                                try {
                                                    await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                        method: "PUT",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            checklist: newChecklist
                                                        })
                                                    });
                                                    onTaskUpdate();
                                                } catch (error) {
                                                    console.error("Error adding checklist item:", error);
                                                }
                                            },
                                            children: "Agregar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                            lineNumber: 645,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 624,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 573,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-[5px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3",
                                    children: "Subtasks"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                    lineNumber: 671,
                                    columnNumber: 13
                                }, this),
                                (()=>{
                                    const renderSubtasks = (subtasks, depth = 0)=>{
                                        if (!subtasks || subtasks.length === 0) return [];
                                        return subtasks.map((subtask)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                style: {
                                                    marginLeft: `${depth * 16}px`
                                                },
                                                className: "text-gray-700 flex items-start gap-2 leading-relaxed",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                        lineNumber: 680,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: subtask.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                                lineNumber: 682,
                                                                columnNumber: 23
                                                            }, this),
                                                            subtask.children && subtask.children.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: "space-y-2 mt-2",
                                                                children: renderSubtasks(subtask.children, depth + 1)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                                lineNumber: 684,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                        lineNumber: 681,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, subtask.id, true, {
                                                fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                lineNumber: 679,
                                                columnNumber: 19
                                            }, this));
                                    };
                                    // Calculate current task depth
                                    const calculateDepth = (t, allTasks = [])=>{
                                        // This is a simplified depth calculation for the modal
                                        // In a real scenario, you'd need to traverse up the parent chain
                                        // For now, we'll use a heuristic based on parentId presence
                                        let depth = 0;
                                        let current = t;
                                        // We can't traverse up without fetching parent data, so we'll use a simpler approach
                                        // Just count if this task has a parentId (depth 1+)
                                        if (current.parentId) depth = 1;
                                        // For more accurate depth, we'd need to fetch the full parent chain
                                        // For now, we'll allow subtask creation and let the backend handle validation
                                        return depth;
                                    };
                                    const currentDepth = calculateDepth(task);
                                    const maxDepth = 5;
                                    const canAddSubtask = currentDepth < maxDepth;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            task.children && task.children.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "space-y-3 mb-4",
                                                children: renderSubtasks(task.children)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                lineNumber: 715,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-500 italic mb-4",
                                                children: "No subtasks yet."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                lineNumber: 719,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-3 mt-[10px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: canAddSubtask ? "New subtask title" : "Max depth reached (5 levels)",
                                                        className: "flex-grow p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-shadow",
                                                        value: subtaskTitle,
                                                        onChange: (e)=>setSubtaskTitle(e.target.value),
                                                        onKeyDown: (e)=>{
                                                            if (e.key === 'Enter' && canAddSubtask) {
                                                                handleAddSubtask();
                                                            }
                                                        },
                                                        disabled: !canAddSubtask
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn-primary whitespace-nowrap",
                                                        onClick: handleAddSubtask,
                                                        disabled: isAddingSubtask || !subtaskTitle.trim() || !canAddSubtask,
                                                        children: isAddingSubtask ? 'Adding...' : 'Add Subtask'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                        lineNumber: 737,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                                lineNumber: 723,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true);
                                })()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 670,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer mt-6 pt-4 border-t border-gray-200 flex justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium",
                                onClick: async ()=>{
                                    if (confirm(`¿Estás seguro de que quieres eliminar "${task.title}"?${task.children && task.children.length > 0 ? ' Esto también eliminará todas sus subtareas.' : ''}`)) {
                                        try {
                                            const response = await fetch(`/api/projects/${task.projectId}/tasks/${task.id}`, {
                                                method: "DELETE"
                                            });
                                            if (response.ok) {
                                                onClose();
                                                onTaskUpdate(); // Refresh the board
                                            } else {
                                                alert("Error al eliminar la tarea");
                                            }
                                        } catch (error) {
                                            console.error("Error deleting task:", error);
                                            alert("Error al eliminar la tarea");
                                        }
                                    }
                                },
                                children: "Eliminar Tarea"
                            }, void 0, false, {
                                fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                                lineNumber: 752,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                            lineNumber: 751,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
                    lineNumber: 203,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
            lineNumber: 180,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/kanban/TaskDetailModal.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this), document.body);
}
_s(TaskDetailModal, "Q4KUib4eM6Dg/a/buI6voPDbFV4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TaskDetailModal;
var _c;
__turbopack_context__.k.register(_c, "TaskDetailModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/kanban/KanbanBoard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KanbanBoard",
    ()=>KanbanBoard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/core/dist/core.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$kanban$2f$Column$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/kanban/Column.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$kanban$2f$Task$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/kanban/Task.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$kanban$2f$TaskDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/kanban/TaskDetailModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const fetcher = (url)=>fetch(url).then((res)=>res.json());
function KanbanBoard({ projectId }) {
    _s();
    const { data: fetchedColumns, error, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(`/api/projects/${projectId}/columns`, fetcher);
    const [columns, setColumns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeItem, setActiveItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Can be a task or a column
    const [selectedTaskId, setSelectedTaskId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // State for modal visibility
    const selectedTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "KanbanBoard.useMemo[selectedTask]": ()=>tasks.find({
                "KanbanBoard.useMemo[selectedTask]": (task)=>task.id === selectedTaskId
            }["KanbanBoard.useMemo[selectedTask]"]) || null
    }["KanbanBoard.useMemo[selectedTask]"], [
        tasks,
        selectedTaskId
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "KanbanBoard.useEffect": ()=>{
            if (fetchedColumns && Array.isArray(fetchedColumns)) {
                setColumns(fetchedColumns);
                const allTasks = fetchedColumns.flatMap({
                    "KanbanBoard.useEffect.allTasks": (col)=>col.tasks.map({
                            "KanbanBoard.useEffect.allTasks": (task)=>({
                                    ...task,
                                    columnId: col.id
                                })
                        }["KanbanBoard.useEffect.allTasks"])
                }["KanbanBoard.useEffect.allTasks"]);
                setTasks(allTasks);
            }
        }
    }["KanbanBoard.useEffect"], [
        fetchedColumns
    ]);
    const sensors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointerSensor"], {
        activationConstraint: {
            distance: 3
        }
    }));
    const columnsId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "KanbanBoard.useMemo[columnsId]": ()=>columns.map({
                "KanbanBoard.useMemo[columnsId]": (col)=>col.id
            }["KanbanBoard.useMemo[columnsId]"])
    }["KanbanBoard.useMemo[columnsId]"], [
        columns
    ]);
    const findColumn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "KanbanBoard.useCallback[findColumn]": (id)=>{
            return columns.find({
                "KanbanBoard.useCallback[findColumn]": (col)=>col.id === id
            }["KanbanBoard.useCallback[findColumn]"]);
        }
    }["KanbanBoard.useCallback[findColumn]"], [
        columns
    ]);
    const findTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "KanbanBoard.useCallback[findTask]": (id)=>{
            return tasks.find({
                "KanbanBoard.useCallback[findTask]": (task)=>task.id === id
            }["KanbanBoard.useCallback[findTask]"]);
        }
    }["KanbanBoard.useCallback[findTask]"], [
        tasks
    ]);
    const onDragStart = (event)=>{
        setActiveItem(event.active);
    };
    const onDragEnd = async (event)=>{
        const { active, over } = event;
        setActiveItem(null);
        if (!over) {
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
            const activeColumnIndex = columns.findIndex((col)=>col.id === activeId);
            const overColumnIndex = columns.findIndex((col)=>col.id === overId);
            const newColumns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayMove"])(columns, activeColumnIndex, overColumnIndex);
            setColumns(newColumns);
            // Update order in backend
            await Promise.all(newColumns.map(async (col, index)=>{
                if (col.order !== index) {
                    await fetch(`/api/projects/${projectId}/columns/${col.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            order: index
                        })
                    });
                }
            }));
            mutate(); // Re-mutate to refetch and ensure state consistency
            return;
        }
        // Handle Task Movement within or between Columns
        if (isActiveATask) {
            const activeTask = tasks.find((task)=>task.id === activeId);
            if (!activeTask) return;
            let newColumnId = activeTask.columnId;
            let newOrder = activeTask.order;
            // Determine the destination column ID
            if (isOverAColumn) {
                newColumnId = overId;
            } else if (isOverATask) {
                const overTask = tasks.find((task)=>task.id === overId);
                if (overTask) {
                    newColumnId = overTask.columnId;
                }
            }
            // Calculate new order for the task
            const tasksInNewColumn = tasks.filter((t)=>t.columnId === newColumnId && t.id !== activeId);
            if (isOverATask) {
                const overTaskIndex = tasksInNewColumn.findIndex((t)=>t.id === overId);
                newOrder = overTaskIndex === -1 ? tasksInNewColumn.length : overTaskIndex;
            } else {
                newOrder = tasksInNewColumn.length;
            }
            // Optimistic update for tasks array
            setTasks((prevTasks)=>{
                // Find the active task before modifying prevTasks
                const activeTaskInPrev = prevTasks.find((task)=>task.id === activeId);
                if (!activeTaskInPrev) return prevTasks; // Should not happen if activeTask is valid
                // Check if this task has children (is a parent task)
                const hasChildren = activeTaskInPrev.children && activeTaskInPrev.children.length > 0;
                const isColumnChanging = activeTaskInPrev.columnId !== newColumnId;
                // Create the moved task with its new properties
                const movedTask = {
                    ...activeTaskInPrev,
                    columnId: newColumnId,
                    order: newOrder
                };
                // Filter out the active task from its original position
                let tasksWithoutActive = prevTasks.filter((t)=>t.id !== activeId);
                // If moving to a different column and has children, also move ALL descendants recursively
                if (isColumnChanging && hasChildren) {
                    // Recursive function to get all descendant IDs
                    const getAllDescendantIds = (parentTaskId, allTasks)=>{
                        const children = allTasks.filter((t)=>t.parentId === parentTaskId);
                        if (children.length === 0) return [];
                        const childIds = children.map((c)=>c.id);
                        const grandchildIds = childIds.flatMap((id)=>getAllDescendantIds(id, allTasks));
                        return [
                            ...childIds,
                            ...grandchildIds
                        ];
                    };
                    const descendantIds = getAllDescendantIds(activeId, prevTasks);
                    // Update all descendants to the new column
                    tasksWithoutActive = tasksWithoutActive.map((t)=>{
                        if (descendantIds.includes(t.id)) {
                            return {
                                ...t,
                                columnId: newColumnId
                            };
                        }
                        return t;
                    });
                }
                if (activeTaskInPrev.columnId === newColumnId) {
                    // Moving within the same column
                    const columnTasks = tasksWithoutActive.filter((t)=>t.columnId === newColumnId).concat(movedTask).sort((a, b)=>a.order - b.order).map((t, index)=>({
                            ...t,
                            order: index
                        }));
                    const otherTasks = prevTasks.filter((t)=>t.columnId !== newColumnId);
                    return [
                        ...otherTasks,
                        ...columnTasks
                    ];
                } else {
                    // Moving between different columns
                    const tasksInSourceColumn = tasksWithoutActive.filter((t)=>t.columnId === activeTaskInPrev.columnId).sort((a, b)=>a.order - b.order) // Ensure stable sort for re-indexing
                    .map((t, index)=>({
                            ...t,
                            order: index
                        }));
                    const tasksInDestinationColumn = tasksWithoutActive.filter((t)=>t.columnId === newColumnId).concat(movedTask) // Add the moved task to the destination column's tasks
                    .sort((a, b)=>a.order - b.order) // Ensure stable sort for re-indexing
                    .map((t, index)=>({
                            ...t,
                            order: index
                        }));
                    // Tasks that were not in the source or destination column
                    const otherTasksUnmodified = prevTasks.filter((t)=>t.columnId !== activeTaskInPrev.columnId && t.columnId !== newColumnId);
                    // Combine all tasks back into a single array
                    return [
                        ...otherTasksUnmodified,
                        ...tasksInSourceColumn,
                        ...tasksInDestinationColumn
                    ];
                }
            });
            // Update backend
            await fetch(`/api/projects/${projectId}/tasks/${activeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    columnId: newColumnId,
                    order: newOrder
                })
            });
            mutate(); // Re-mutate to refetch and ensure state consistency
            return;
        }
        mutate(); // If nothing moved or dropped outside, re-mutate to ensure consistency
    };
    // Function to add a new column
    const handleAddColumn = async ()=>{
        const newColumnName = prompt("Enter new column name:");
        if (newColumnName) {
            try {
                const response = await fetch(`/api/projects/${projectId}/columns`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: newColumnName
                    })
                });
                if (response.ok) {
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
    const handleCreateTask = async (columnId)=>{
        const newTaskTitle = prompt("Enter new task title:");
        if (newTaskTitle) {
            try {
                const response = await fetch(`/api/projects/${projectId}/tasks`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: newTaskTitle,
                        columnId
                    })
                });
                if (response.ok) {
                    mutate(); // Re-fetch data to include the new task
                } else {
                    console.error("Failed to add task");
                }
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    };
    const handleEditColumnName = async (columnId, currentName)=>{
        const newName = prompt("Edit column name:", currentName);
        if (newName && newName !== currentName) {
            try {
                const response = await fetch(`/api/projects/${projectId}/columns/${columnId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: newName
                    })
                });
                if (response.ok) {
                    mutate();
                } else {
                    console.error("Failed to edit column name");
                }
            } catch (error) {
                console.error("Error editing column name:", error);
            }
        }
    };
    const handleDeleteColumn = async (columnId)=>{
        if (confirm("Are you sure you want to delete this column and all its tasks?")) {
            try {
                const response = await fetch(`/api/projects/${projectId}/columns/${columnId}`, {
                    method: "DELETE"
                });
                if (response.ok) {
                    mutate();
                } else {
                    console.error("Failed to delete column");
                }
            } catch (error) {
                console.error("Error deleting column:", error);
            }
        }
    };
    const handleTaskClick = (taskId)=>{
        console.log("Task clicked:", taskId); // Debugging
        setSelectedTaskId(taskId);
        setIsModalOpen(true);
        console.log("isModalOpen set to true"); // Debugging
    };
    const handleCloseModal = ()=>{
        setIsModalOpen(false);
        setSelectedTaskId(null);
        console.log("Modal closed"); // Debugging
    };
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Failed to load kanban board."
    }, void 0, false, {
        fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
        lineNumber: 357,
        columnNumber: 21
    }, this);
    if (!fetchedColumns) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Loading..."
    }, void 0, false, {
        fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
        lineNumber: 358,
        columnNumber: 31
    }, this); // Use fetchedColumns for initial loading check
    const activeTaskContent = activeItem?.data.current?.type === "Task" ? tasks.find((t)=>t.id === activeItem.id) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "header-title",
                        children: "< Project"
                    }, void 0, false, {
                        fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                        lineNumber: 367,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handleAddColumn,
                        className: "btn-primary",
                        children: "Add Column"
                    }, void 0, false, {
                        fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                        lineNumber: 368,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                lineNumber: 366,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "kanban overflow-x-auto whitespace-nowrap min-h-screen",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DndContext"], {
                    sensors: sensors,
                    onDragStart: onDragStart,
                    onDragEnd: onDragEnd,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SortableContext"], {
                            items: columnsId,
                            children: columns.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$kanban$2f$Column$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Column"], {
                                    id: column.id,
                                    title: column.name,
                                    tasks: tasks.filter((task)=>task.columnId === column.id).sort((a, b)=>a.order - b.order),
                                    onEditName: handleEditColumnName,
                                    onDelete: handleDeleteColumn,
                                    onCreateTask: handleCreateTask,
                                    onTaskClick: handleTaskClick
                                }, column.id, false, {
                                    fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                                    lineNumber: 379,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                            lineNumber: 377,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DragOverlay"], {
                            children: [
                                activeItem && activeItem.data.current?.type === "Task" && activeTaskContent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$kanban$2f$Task$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Task"], {
                                    id: activeTaskContent.id,
                                    title: activeTaskContent.title,
                                    isActive: false,
                                    className: "dragging",
                                    subtasksCount: activeTaskContent.children?.length || 0,
                                    parentId: activeTaskContent.parentId
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                                    lineNumber: 394,
                                    columnNumber: 17
                                }, this) : null,
                                activeItem && activeItem.data.current?.type === "Column" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "column dragging",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "column-title",
                                        children: findColumn(activeItem.id.toString())?.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                                        lineNumber: 405,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                                    lineNumber: 404,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                            lineNumber: 392,
                            columnNumber: 13
                        }, this), document.body)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                lineNumber: 371,
                columnNumber: 7
            }, this),
            isModalOpen && selectedTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$kanban$2f$TaskDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskDetailModal"], {
                task: selectedTask,
                onClose: handleCloseModal,
                onTaskUpdate: mutate
            }, selectedTask.id, false, {
                fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
                lineNumber: 415,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/kanban/KanbanBoard.tsx",
        lineNumber: 365,
        columnNumber: 5
    }, this);
}
_s(KanbanBoard, "N2XqPmPfNie+T+xO5B5UlEiV1Vk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"]
    ];
});
_c = KanbanBoard;
var _c;
__turbopack_context__.k.register(_c, "KanbanBoard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/kanban/KanbanBoard.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/kanban/KanbanBoard.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_5e97bbc4._.js.map