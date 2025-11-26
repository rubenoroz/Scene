import * as XLSX from 'xlsx';

interface ExportTask {
    id: string;
    title: string;
    startDate?: string | null;
    endDate?: string | null;
    status?: string;
    priority?: string | null;
    assignees?: { name: string | null; email: string | null }[];
    columnId?: string;
    level?: number;
}

export const exportToExcel = (tasks: ExportTask[], columns: { id: string; name: string }[], projectName: string) => {
    // Create a map of column IDs to names for status lookup
    const columnMap = new Map(columns.map(c => [c.id, c.name]));

    // Transform data for Excel
    const data = tasks.map(task => {
        const status = columnMap.get(task.columnId || '') || 'Unknown';
        const assignees = task.assignees?.map(a => a.name || a.email).join(', ') || '';

        // Indent title based on level to show hierarchy
        const indentation = task.level ? '  '.repeat(task.level) : '';
        const title = indentation + task.title;

        return {
            'Tarea': title,
            'Estado': status,
            'Prioridad': task.priority || '',
            'Asignado a': assignees,
            'Fecha Inicio': task.startDate ? new Date(task.startDate).toLocaleDateString() : '',
            'Fecha Fin': task.endDate ? new Date(task.endDate).toLocaleDateString() : '',
        };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-size columns (simple approximation)
    const colWidths = [
        { wch: 40 }, // Tarea
        { wch: 15 }, // Estado
        { wch: 10 }, // Prioridad
        { wch: 25 }, // Asignado a
        { wch: 12 }, // Fecha Inicio
        { wch: 12 }, // Fecha Fin
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Cronograma');

    // Generate Excel file
    const fileName = `${projectName.replace(/\s+/g, '_')}_Gantt.xlsx`;
    XLSX.writeFile(wb, fileName);
};
