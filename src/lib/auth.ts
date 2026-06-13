import { reactive, watch } from "vue";
import { api } from "./api";
export interface User {
  role: "estudiante" | "familia" | "postulante";
  username: string;
  name: string;
  studentName?: string;
  careerSuggestion?: string;
  linkedStudentCode?: string;
  linkedStudentRole?: "estudiante" | "postulante";
}

const STORAGE_KEY = "nexus_auth_user";

const savedUser = localStorage.getItem(STORAGE_KEY);
const state = reactive<{
  user: User | null;
}>({
  user: savedUser ? JSON.parse(savedUser) : null,
});

watch(
  () => state.user,
  (newUser) => {
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("nexus_vocational_result");
      localStorage.removeItem("nexus_linked_student_code");
    }
  },
  { deep: true },
);

export async function login(
  role: "estudiante" | "familia" | "postulante",
  username: string,
  password?: string,
  customName?: string,
) {
  let name = customName || "";
  let studentName = "";
  let careerSuggestion = "";
  let linkedStudentCode = "";
  let linkedStudentRole: "estudiante" | "postulante" | undefined = undefined;

  if (password && password !== "google_mock_pass") {
    try {
      const response = await api.post('/auth/login', { email: username, password })
      const token = response.data.data?.token
      if (token) {
        localStorage.setItem('nexus_jwt_token', token)
      }
      
      // Update data with real backend info if available
      const backendUser = response.data.data?.usuario
      if (backendUser) {
        username = backendUser.email || username
        if (backendUser.nombre) {
          name = `${backendUser.nombre} ${backendUser.apellido || ''}`.trim()
        }
      }
    } catch (error) {
      console.error("API Login failed:", error);
      throw error;
    }
  }

  if (!name) {
    if (role === "estudiante") {
      name = "Alejandro Lastra Torres";
    } else if (role === "familia") {
      name = "Marisela Torres";
      // Load saved linkage if any
      const savedCode = localStorage.getItem("nexus_linked_student_code");
      if (savedCode) {
        linkedStudentCode = savedCode;
        studentName =
          savedCode === "NEX-ALE-2026"
            ? "Alejandro Lastra Torres"
            : "Camila Ramos";
        linkedStudentRole =
          savedCode === "NEX-ALE-2026" ? "estudiante" : "postulante";
      }
    } else if (role === "postulante") {
      name = "Camila Ramos";
      const savedResult = localStorage.getItem("nexus_vocational_result");
      if (savedResult) {
        careerSuggestion = savedResult;
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
    linkedStudentRole,
  };
  return state.user;
}

export async function loginWithGoogle(
  credential: string,
  role: string,
  pin?: string,
) {
  try {
    const response = await api.post("/auth/google", {
      idToken: credential,
    });

    const userData = response.data.data;

    const jwtToken = userData.token;
    localStorage.setItem("nexus_jwt_token", jwtToken);

    state.user = {
      role: role as any,
      username: userData.email,
      name: `${userData.nombre} ${userData.apellido || ""}`.trim(),
    };

    return state.user;
  } catch (error) {
    console.error("Google Login failed:", error);
    throw error;
  }
}

export function logout() {
  state.user = null;
}

export function updateCareerSuggestion(career: string) {
  if (state.user && state.user.role === "postulante") {
    state.user.careerSuggestion = career;
    localStorage.setItem("nexus_vocational_result", career);
  }
}

export function linkStudent(code: string): boolean {
  const cleanCode = code.trim().toUpperCase();
  if (cleanCode === "NEX-ALE-2026") {
    if (state.user && state.user.role === "familia") {
      state.user.linkedStudentCode = cleanCode;
      state.user.studentName = "Alejandro Lastra Torres";
      state.user.linkedStudentRole = "estudiante";
      localStorage.setItem("nexus_linked_student_code", cleanCode);
      return true;
    }
  } else if (cleanCode === "NEX-CAM-2026") {
    if (state.user && state.user.role === "familia") {
      state.user.linkedStudentCode = cleanCode;
      state.user.studentName = "Camila Ramos";
      state.user.linkedStudentRole = "postulante";
      localStorage.setItem("nexus_linked_student_code", cleanCode);
      return true;
    }
  }
  return false;
}

export function unlinkStudent() {
  if (state.user && state.user.role === "familia") {
    state.user.linkedStudentCode = undefined;
    state.user.studentName = undefined;
    state.user.linkedStudentRole = undefined;
    localStorage.removeItem("nexus_linked_student_code");
  }
}

export function useAuth() {
  return {
    state,
    login,
    loginWithGoogle,
    logout,
    updateCareerSuggestion,
    linkStudent,
    unlinkStudent,
  };
}
