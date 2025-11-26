"use client";
import React, { useState, useCallback } from "react";
import { Upload, X, File, Image as ImageIcon } from "lucide-react";

interface FileUploaderProps {
    projectId: string;
    taskId: string;
    onUploadComplete: (fileData: {
        url: string;
        name: string;
        size: number;
        type: string;
        uploadedAt: string;
    }) => void;
}

export function FileUploader({ projectId, taskId, onUploadComplete }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("projectId", projectId);
            formData.append("taskId", taskId);

            // Simulate progress (since we can't track real progress easily with fetch)
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Upload failed");
            }

            const fileData = await response.json();
            onUploadComplete(fileData);

            // Reset after success
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
        } catch (err) {
            console.error("Upload error:", err);
            setError(err instanceof Error ? err.message : "Upload failed");
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                await uploadFile(files[0]);
            }
        },
        [projectId, taskId]
    );

    const handleFileSelect = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                await uploadFile(files[0]);
            }
            // Reset input
            e.target.value = "";
        },
        [projectId, taskId]
    );

    return (
        <div className="w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}
          ${isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-blue-400"}
        `}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="space-y-3">
                        <Upload className="w-8 h-8 mx-auto text-blue-500 animate-bounce" />
                        <p className="text-sm text-gray-600">Subiendo archivo...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500">{uploadProgress}%</p>
                    </div>
                ) : (
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                            Arrastra un archivo aquí o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-gray-400">
                            Máximo 50MB • Imágenes, videos, PDFs, documentos
                        </p>
                    </label>
                )}
            </div>

            {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
}
