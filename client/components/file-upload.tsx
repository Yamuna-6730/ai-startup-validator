"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File as FileIcon, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export default function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      onFileSelect(droppedFile);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer
              transition-all duration-300 group
              ${isDragging 
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]" 
                : "border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-900/50"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <div className={`
              bg-slate-100 dark:bg-zinc-800 p-4 rounded-2xl mb-4 
              transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
              ${isDragging ? "bg-blue-100 dark:bg-blue-800 scale-110" : ""}
            `}>
              <Upload size={24} className={isDragging ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"} />
            </div>
            
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                {isDragging ? "Drop your file here" : "Click or drag documents here"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Support for PDF, DOCX, or Images
              </p>
            </div>

            {/* Subtle progress indicator dots for visual interest */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 opacity-30">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-5 rounded-2xl"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="relative">
                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl shrink-0">
                  <FileIcon size={24} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                  <CheckCircle2 size={12} />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-blue-900 dark:text-blue-100 truncate">
                  {file.name}
                </span>
                <span className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                </span>
              </div>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={removeFile}
              disabled={disabled}
              className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl w-10 h-10 shrink-0 transition-colors"
            >
              <X size={18} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
