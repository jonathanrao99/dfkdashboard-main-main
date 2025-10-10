'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye } from 'lucide-react'

interface ReceiptUploadProps {
  onUpload: (file: File) => Promise<{
    success: boolean
    url?: string
    message: string
  }>
  existingUrl?: string
  onRemove?: () => void
  maxSize?: number // in MB
}

export default function ReceiptUpload({ 
  onUpload, 
  existingUrl, 
  onRemove,
  maxSize = 5 
}: ReceiptUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    url?: string
    message: string
  } | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const result = await onUpload(file)
      setUploadResult(result)
      setUploadProgress(100)
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Upload failed. Please try again.'
      })
    } finally {
      setUploading(false)
      clearInterval(progressInterval)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    disabled: uploading
  })

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    }
    setUploadResult(null)
  }

  const currentUrl = uploadResult?.url || existingUrl

  return (
    <div className="space-y-4">
      {currentUrl ? (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Receipt uploaded</p>
                <p className="text-xs text-gray-500">
                  {uploadResult?.success ? 'Upload successful' : 'Previously uploaded'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(currentUrl, '_blank')}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
            ${isDragActive 
              ? 'border-emerald-400 bg-emerald-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-3">
            <Upload className="h-8 w-8 text-gray-400" />
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isDragActive ? 'Drop receipt here' : 'Upload receipt'}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop or click to browse
              </p>
            </div>

            {!uploading && (
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            )}
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading receipt...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {fileRejections.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {fileRejections[0].errors.map(error => (
              <div key={error.code}>
                {error.code === 'file-too-large' 
                  ? `File is too large. Maximum size is ${maxSize}MB.`
                  : error.message
                }
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {uploadResult && !uploadResult.success && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {uploadResult.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500">
        Supported formats: JPG, PNG, PDF (max {maxSize}MB)
      </div>
    </div>
  )
}


