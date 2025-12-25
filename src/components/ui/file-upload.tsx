'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from './button';
import { apiCall } from '@/lib/api-client';

export interface FileUploadProps {
  onUploadSuccess?: (url: string, file: File) => void;
  onUploadError?: (error: Error) => void;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
  folder?: string;
  isPublic?: boolean;
  documentType?: string;
  careLogId?: string;
  children?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  accept = 'image/*,application/pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  className = '',
  disabled = false,
  folder,
  isPublic = false,
  documentType,
  careLogId,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate files
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        onUploadError?.(new Error(`File "${file.name}" exceeds size limit of ${maxSize / 1024 / 1024}MB`));
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // If not multiple, only take the first file
    const filesToUpload = multiple ? validFiles : [validFiles[0]];
    setSelectedFiles(filesToUpload);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    handleFileSelect(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);
      setUploadError(null);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', selectedFiles[0]);

      if (folder) formData.append('folder', folder);
      if (isPublic) formData.append('isPublic', 'true');
      if (documentType) formData.append('documentType', documentType);
      if (careLogId) formData.append('careLogId', careLogId);

      const data = await apiCall('/upload', {
        method: 'POST',
        body: formData,
        isFormData: true,
      });

      if (data.success) {
        onUploadSuccess?.(data.data.url, selectedFiles[0]);
        setSelectedFiles([]);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Upload failed');
      setUploadError(errorObj);
      onUploadError?.(errorObj);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const openFileDialog = () => {
    if (disabled || !fileInputRef.current) return;
    fileInputRef.current.click();
  };

  return (
    <div className={`file-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {children ? (
          children
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📁</div>
            <div className="text-lg font-medium">
              {dragActive ? 'Drop files here' : 'Drag & drop files here'}
            </div>
            <div className="text-sm text-gray-500">
              or click to browse
            </div>
            <div className="text-xs text-gray-400">
              Max file size: {maxSize / 1024 / 1024}MB
            </div>
          </div>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Selected Files:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">
                    {file.type.startsWith('image/') ? '🖼️' : '📄'}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <Button
              onClick={handleUpload}
              disabled={uploading || disabled}
              variant="default"
            >
              {uploading ? `Uploading... ${uploadProgress > 0 ? `${uploadProgress}%` : ''}` : 'Upload'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedFiles([])}
              disabled={uploading}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {uploadError.message}
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};