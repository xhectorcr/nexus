import { reactive, watch } from 'vue'

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

export function login(role: 'estudiante' | 'familia' | 'postulante', username: string, customName?: string) {
  let name = customName || ''
  let studentName = ''
  let careerSuggestion = ''
  let linkedStudentCode = ''
  let linkedStudentRole: 'estudiante' | 'postulante' | undefined = undefined

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
