-- 1. Verificar si existen las tareas (Conteo total)
SELECT count(*) as total_tareas FROM "Task";

-- 2. Verificar tareas por Proyecto (para asegurar que tu proyecto tiene datos)
SELECT "projectId", count(*) as tareas_por_proyecto 
FROM "Task" 
GROUP BY "projectId";

-- 3. Verificar tareas por Columna (para ver si están asignadas a columnas)
SELECT "columnId", count(*) as tareas_por_columna 
FROM "Task" 
GROUP BY "columnId";

-- 4. Verificar Jerarquía (Padres e Hijos)
-- Cuántas son tareas principales (sin padre) vs subtareas (con padre)
SELECT 
  CASE WHEN "parentId" IS NULL THEN 'Principal' ELSE 'Subtarea' END as tipo,
  count(*) 
FROM "Task" 
GROUP BY "parentId" IS NULL;

-- 5. Ver las últimas 5 tareas creadas (para ver si se guardaron las recientes)
SELECT id, title, "createdAt" 
FROM "Task" 
ORDER BY "createdAt" DESC 
LIMIT 5;
