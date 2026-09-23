import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { apiClient } from '@/services/api'
import { toast } from 'react-toastify'

export default function ResumeUploadPage() {
  const [resume, setResume] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)

  useEffect(() => {
    fetchResume()
  }, [])

  const fetchResume = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getResume()
      const resumeData = response.data?.resume || response.data
      const normalizedResume = Array.isArray(resumeData) ? resumeData[0] : resumeData
      if (normalizedResume) {
        setResume(normalizedResume)
      }
    } catch (error) {
      console.log('No resume found')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]

    try {
      setLoading(true)
      const response = await apiClient.uploadResume(file)
      const uploadedResume = response.data?.resume || response.data?.data || response.data
      setResume(uploadedResume)
      toast.success('Resume uploaded successfully! Processing...')
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to upload resume'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Resume</h1>
        <p className="mt-2 text-gray-600">
          Upload your resume to get started. We'll extract your skills and experience.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-primary-600'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div>
                <p className="text-lg font-medium text-primary-600">Drop your resume here...</p>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-12-8l-4-4m4 4v12m0 0l-4-4m4 4l4-4"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-4 text-lg font-medium text-gray-900">Upload Your Resume</p>
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your PDF resume here, or click to select
                </p>
              </div>
            )}
          </div>
          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Processing...</span>
            </div>
          )}
        </div>

        {/* Resume Details Section */}
        {resume && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume Information</h2>

            {/* File Info */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">File Details</h3>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {resume.fileName || resume.file_name || 'Resume PDF'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Size:</strong> {((resume.fileSize || resume.file_size || 0) / 1024).toFixed(2)} KB
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Parsed:</strong> {new Date(resume.parsedAt || resume.parsed_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Skills */}
            {(resume.extractedSkills || resume.extracted_skills || []).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(resume.extractedSkills || resume.extracted_skills).slice(0, 10).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {(resume.extractedExperience || resume.extracted_experience) && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Experience</h3>
                <div className="bg-gray-50 rounded p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Years:</strong> {(resume.extractedExperience || resume.extracted_experience)?.years || 'Not specified'}
                  </p>
                  {((resume.extractedExperience || resume.extracted_experience)?.titles || []).length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Titles:</strong> {((resume.extractedExperience || resume.extracted_experience).titles || []).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {(resume.extractedEducation || resume.extracted_education || []).length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Education</h3>
                <ul className="space-y-1">
                  {(resume.extractedEducation || resume.extracted_education).slice(0, 3).map((edu: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600">
                      • {edu}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Next Steps */}
      {resume && (
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Start Interviewing?</h3>
            <p className="text-blue-700 mb-4">
              Your resume has been processed and your skills have been extracted. Ready to create an interview?
            </p>
            <a
              href="/interview/new"
              className="btn-primary inline-block"
            >
              Start Interview Session
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
