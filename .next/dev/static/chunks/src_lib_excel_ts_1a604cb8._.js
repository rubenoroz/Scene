(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/excel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exportToExcel",
    ()=>exportToExcel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$exceljs$2f$dist$2f$exceljs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/exceljs/dist/exceljs.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$file$2d$saver$2f$dist$2f$FileSaver$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/file-saver/dist/FileSaver.min.js [app-client] (ecmascript)");
;
;
const exportToExcel = async (tasks, columns, projectName)=>{
    const workbook = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$exceljs$2f$dist$2f$exceljs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Workbook();
    const worksheet = workbook.addWorksheet('Cronograma');
    // --- 1. Setup Columns ---
    worksheet.columns = [
        {
            header: 'Tarea',
            key: 'title',
            width: 40
        },
        {
            header: 'Estado',
            key: 'status',
            width: 15
        },
        {
            header: 'Prioridad',
            key: 'priority',
            width: 12
        },
        {
            header: 'Asignado a',
            key: 'assignees',
            width: 25
        },
        {
            header: 'Inicio',
            key: 'startDate',
            width: 12
        },
        {
            header: 'Fin',
            key: 'endDate',
            width: 12
        }
    ];
    // --- 2. Calculate Timeline Range ---
    const dates = tasks.flatMap((t)=>[
            t.startDate,
            t.endDate
        ]).filter(Boolean).map((d)=>new Date(d));
    let minDate = dates.length ? new Date(Math.min(...dates.map((d)=>d.getTime()))) : new Date();
    let maxDate = dates.length ? new Date(Math.max(...dates.map((d)=>d.getTime()))) : new Date();
    // Add padding
    minDate.setDate(minDate.getDate() - 3);
    maxDate.setDate(maxDate.getDate() + 7);
    // --- 3. Add Timeline Headers ---
    // We'll add dates starting from column G (index 7, 1-based)
    let currentDate = new Date(minDate);
    let colIndex = 7;
    const dateColMap = new Map();
    while(currentDate <= maxDate){
        const dateStr = currentDate.toISOString().split('T')[0];
        const cell = worksheet.getCell(1, colIndex);
        cell.value = currentDate.getDate(); // Just the day number
        cell.alignment = {
            horizontal: 'center'
        };
        // Style the header
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFE0E0E0'
            }
        };
        cell.border = {
            left: {
                style: 'thin',
                color: {
                    argb: 'FFCCCCCC'
                }
            },
            right: {
                style: 'thin',
                color: {
                    argb: 'FFCCCCCC'
                }
            }
        };
        // Add month header above if it's the first day or first col
        if (currentDate.getDate() === 1 || colIndex === 7) {
        // We could merge cells for months, but for simplicity let's just put it in the tooltip or comment
        // Or maybe add a row above. For now, simple day numbers.
        }
        dateColMap.set(dateStr, colIndex);
        // Set column width for the timeline
        worksheet.getColumn(colIndex).width = 4;
        currentDate.setDate(currentDate.getDate() + 1);
        colIndex++;
    }
    // --- 4. Add Data and Bars ---
    const columnMap = new Map(columns.map((c)=>[
            c.id,
            c
        ]));
    tasks.forEach((task, index)=>{
        const rowIndex = index + 2; // 1-based, +1 for header
        const row = worksheet.getRow(rowIndex);
        // Basic Data
        const statusCol = columnMap.get(task.columnId || '');
        const statusName = statusCol?.name || 'Unknown';
        const statusColor = statusCol?.color || '#E0E0E0';
        const assignees = task.assignees?.map((a)=>a.name || a.email).join(', ') || '';
        // Indentation for hierarchy
        const indentation = task.level ? '    '.repeat(task.level) : '';
        row.getCell('title').value = indentation + task.title;
        row.getCell('status').value = statusName;
        row.getCell('priority').value = task.priority;
        row.getCell('assignees').value = assignees;
        row.getCell('startDate').value = task.startDate ? new Date(task.startDate).toLocaleDateString() : '';
        row.getCell('endDate').value = task.endDate ? new Date(task.endDate).toLocaleDateString() : '';
        // Gantt Bar Coloring
        if (task.startDate && task.endDate) {
            const start = new Date(task.startDate);
            const end = new Date(task.endDate);
            let curr = new Date(start);
            while(curr <= end){
                const dateStr = curr.toISOString().split('T')[0];
                const colIdx = dateColMap.get(dateStr);
                if (colIdx) {
                    const cell = row.getCell(colIdx);
                    // Remove # from hex color
                    const argbColor = 'FF' + (statusColor.replace('#', '') || '3B82F6');
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: argbColor
                        }
                    };
                }
                curr.setDate(curr.getDate() + 1);
            }
        }
    });
    // --- 5. Final Styling ---
    // Header row style
    worksheet.getRow(1).font = {
        bold: true
    };
    worksheet.getRow(1).border = {
        bottom: {
            style: 'medium'
        }
    };
    // Generate File
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${projectName.replace(/\s+/g, '_')}_Gantt_Visual.xlsx`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$file$2d$saver$2f$dist$2f$FileSaver$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveAs"])(new Blob([
        buffer
    ]), fileName);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_excel_ts_1a604cb8._.js.map