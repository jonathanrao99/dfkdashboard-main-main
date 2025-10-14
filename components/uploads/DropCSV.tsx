'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

export function DropCSV({ source, onUploadSuccess }: { source: string, onUploadSuccess: (data: any) => void }) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('source', source)

    const promise = fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    }).then(res => {
      if (!res.ok) throw new Error('Upload failed')
      return res.json()
    })

    toast.promise(promise, {
      loading: `Uploading ${file.name}...`,
      success: (data) => {
        onUploadSuccess(data)
        return `${data.rows_loaded} rows loaded successfully.`
      },
      error: 'Failed to upload file.',
    })
  }, [source, onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] } })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-brand-600 bg-brand-100' : 'border-border hover:border-brand-600/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 text-text-secondary">
        <UploadCloud className="h-8 w-8" />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag 'n' drop a CSV file here, or click to select a file</p>
        )}
      </div>
    </div>
  )
}
