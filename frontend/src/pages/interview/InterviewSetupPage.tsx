import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/services/api'
import { toast } from 'react-toastify'

interface JobRole {
  id: number
  title: string
  description: string
  required_skills: string[]
  experience_level: string
  difficulty_score: number
}

export default function InterviewSetupPage() {
  const navigate = useNavigate()
  const [jobRoles, setJobRoles] = useState<JobRole[]>([])
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchJobRoles()
  }, [])

  const fetchJobRoles = async () => {
    try {
      setLoading(true)
      const response = await apiClient.client.get('/interviews/job-roles/')
      setJobRoles(response.data.results || response.data)
    } catch (error) {
      console.error('Failed to fetch job roles')
      toast.error('Failed to load job roles')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = async () => {
    if (!selectedRole) {
      toast.warning('Please select a job role')
      return
    }

    try {
      setCreating(true)
      const response = await apiClient.createInterviewSession(selectedRole)
      toast.success('Interview session created!')
      navigate(`/interview/${response.data.data.id}`)
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to create session'
      toast.error(errorMsg)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Start an Interview</h1>
        <p className="mt-2 text-gray-600">
          Select a job role to start your personalized interview session
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Job Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`card cursor-pointer transition-all ${
                  selectedRole === role.id
                    ? 'ring-2 ring-primary-600 shadow-lg'
                    : 'hover:shadow-lg'
                }`}
              >
                {/* Selected Indicator */}
                {selectedRole === role.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.title}</h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{role.description}</p>

                {/* Experience Level */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {role.experience_level === 'entry' && 'Entry Level'}
                    {role.experience_level === 'mid' && 'Mid Level'}
                    {role.experience_level === 'senior' && 'Senior Level'}
                  </span>
                </div>

                {/* Difficulty */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Difficulty</span>
                    <span className="text-xs font-medium text-gray-700">
                      {role.difficulty_score.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(role.difficulty_score / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Required Skills */}
                {role.required_skills && role.required_skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.required_skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {role.required_skills.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          +{role.required_skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Create Button */}
          {jobRoles.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleCreateSession}
                disabled={!selectedRole || creating}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating Session...' : 'Create Interview Session'}
              </button>
            </div>
          )}

          {/* Empty State */}
          {jobRoles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No job roles available</p>
              <p className="text-sm text-gray-500">
                Please contact administrator to add job roles
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
