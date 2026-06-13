import { reactive, watch } from 'vue'
import { api } from './api'
export interface User {
  role: 'estudiante' | 'familia' | 'postulante'
  username: string
  name: string
  studentName?: string // for family members
  careerSuggestion?: string // for postulante
  linkedStudentCode?: string // for family members (NEX-ALE-2026 or NEX-CAM-2026)
  linkedStudentRole?: 'estudiante' | 'postulante' // to decide what to show
}

const STORAGE_KEY = 'nexus_auth_user'

const savedUser = localStorage.getItem(STORAGE_KEY)
const state = reactive<{
  user: User | null
}>({
  user: savedUser ? JSON.parse(savedUser) : null
})

// Watch state changes to persist user session
watch(() => state.user, (newUser) => {
  if (newUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
  } else {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('nexus_vocational_result') // Clear test on logout
    localStorage.removeItem('nexus_linked_student_code') // Clear linkage code
  }
}, { deep: true })

export async function login(role: 'estudiante' | 'familia' | 'postulante', username: string, password?: string, customName?: string) {
  let name = customName || ''
  let studentName = ''
  let careerSuggestion = ''
  let linkedStudentCode = ''
  let linkedStudentRole: 'estudiante' | 'postulante' | undefined = undefined

  // Attempt real API authentication if a password is provided
  if (password && password !== 'google_mock_pass') {
    try {
      const response = await api.post('/auth/login', { email: username, password })
      const token = response.data.token
      localStorage.setItem('nexus_jwt_token', token)
      
      // Update data with real backend info if available
      username = response.data.email || username
      if (response.data.nombre) {
        name = `${response.data.nombre} ${response.data.apellido || ''}`.trim()
      }
    } catch (error) {
      console.error('API Login failed:', error)
      throw error // Re-throw to be caught by the frontend components
    }
  }

  if (!name) {
    if (role === 'estudiante') {
      name = 'Alejandro Lastra Torres'
    } else if (role === 'familia') {
      name = 'Marisela Torres'
      // Load saved linkage if any
      const savedCode = localStorage.getItem('nexus_linked_student_code')
      if (savedCode) {
        linkedStudentCode = savedCode
        studentName = savedCode === 'NEX-ALE-2026' ? 'Alejandro Lastra Torres' : 'Camila Ramos'
        linkedStudentRole = savedCode === 'NEX-ALE-2026' ? 'estudiante' : 'postulante'
      }
    } else if (role === 'postulante') {
      name = 'Camila Ramos'
      const savedResult = localStorage.getItem('nexus_vocational_result')
      if (savedResult) {
        careerSuggestion = savedResult
      }
    }
  }

  state.user = {
    role,
    username,
    name,
    studentName: studentName || undefined,
    careerSuggestion: careerSuggestion || undefined,
    linkedStudentCode: linkedStudentCode || undefined,
    linkedStudentRole
  }
  return state.user
}

export function logout() {
  state.user = null
}

export function updateCareerSuggestion(career: string) {
  if (state.user && state.user.role === 'postulante') {
    state.user.careerSuggestion = career
    localStorage.setItem('nexus_vocational_result', career)
  }
}

export function linkStudent(code: string): boolean {
  const cleanCode = code.trim().toUpperCase()
  if (cleanCode === 'NEX-ALE-2026') {
    if (state.user && state.user.role === 'familia') {
      state.user.linkedStudentCode = cleanCode
      state.user.studentName = 'Alejandro Lastra Torres'
      state.user.linkedStudentRole = 'estudiante'
      localStorage.setItem('nexus_linked_student_code', cleanCode)
      return true
    }
  } else if (cleanCode === 'NEX-CAM-2026') {
    if (state.user && state.user.role === 'familia') {
      state.user.linkedStudentCode = cleanCode
      state.user.studentName = 'Camila Ramos'
      state.user.linkedStudentRole = 'postulante'
      localStorage.setItem('nexus_linked_student_code', cleanCode)
      return true
    }
  }
  return false
}

export function unlinkStudent() {
  if (state.user && state.user.role === 'familia') {
    state.user.linkedStudentCode = undefined
    state.user.studentName = undefined
    state.user.linkedStudentRole = undefined
    localStorage.removeItem('nexus_linked_student_code')
  }
}

export function useAuth() {
  return {
    state,
    login,
    logout,
    updateCareerSuggestion,
    linkStudent,
    unlinkStudent
  }
}
