import { reactive, watch } from "vue";
import { api } from "./api";

export interface User {
  id?: number;
  role: "estudiante" | "familia" | "postulante";

  username: string;
  name: string;

  vinculado?: boolean;
  studentName?: string;
  careerSuggestion?: string;
  linkedStudentRole?: "estudiante" | "postulante";

  codigoVinculacion?: string;
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
      localStorage.removeItem("nexus_jwt_token");
    }
  },
  { deep: true },
);

export async function fetchFamiliarProfile() {
  const response = await api.get("/api/familiar/me");

  return response.data.data ?? response.data;
}

export async function login(
  role: "estudiante" | "familia" | "postulante",
  username: string,
  password?: string,
) {
  try {
    const response = await api.post("/auth/login", {
      email: username,
      password,
    });

    const userData = response.data.data;

    localStorage.setItem("nexus_jwt_token", userData.token);

    const user: User = {
      id: userData.id,
      role,
      username: userData.email,
      name: `${userData.nombre} ${userData.apellido ?? ""}`.trim(),
    };

    if (role === "familia") {
      const familiar = await fetchFamiliarProfile();

      user.vinculado = familiar.vinculado;

      user.studentName = familiar.nombreVinculado;

      user.linkedStudentRole =
        familiar.tipo === "ESTUDIANTE"
          ? "estudiante"
          : familiar.tipo === "POSTULANTE"
            ? "postulante"
            : undefined;
    }

    if (role === "postulante") {
      const codigo = await fetchPostulanteCodigo();
      user.codigoVinculacion = codigo;
    }

    state.user = user;

    return user;
  } catch (error) {
    console.error("API Login failed:", error);
    throw error;
  }
}

export async function loginWithGoogle(credential: string, role: string) {
  try {
    const response = await api.post("/auth/google", {
      idToken: credential,
    });

    const userData = response.data.data;

    localStorage.setItem("nexus_jwt_token", userData.token);

    const user: User = {
      id: userData.id,
      role: role as User["role"],
      username: userData.email,
      name: `${userData.nombre} ${userData.apellido ?? ""}`.trim(),
    };

    if (role === "familia") {
      const familiar = await fetchFamiliarProfile();

      user.vinculado = familiar.vinculado;

      user.studentName = familiar.nombreVinculado;

      user.linkedStudentRole =
        familiar.tipo === "ESTUDIANTE"
          ? "estudiante"
          : familiar.tipo === "POSTULANTE"
            ? "postulante"
            : undefined;
    }

    if (role === "postulante") {
      const codigo = await fetchPostulanteCodigo();
      user.codigoVinculacion = codigo;
    }

    state.user = user;

    return user;
  } catch (error) {
    console.error("Google Login failed:", error);
    throw error;
  }
}

export async function refreshFamiliarProfile() {
  if (!state.user || state.user.role !== "familia") {
    return;
  }

  const familiar = await fetchFamiliarProfile();

  state.user = {
    ...state.user,
    vinculado: familiar.vinculado,
    studentName: familiar.nombreVinculado,
    linkedStudentRole:
      familiar.tipo === "ESTUDIANTE"
        ? "estudiante"
        : familiar.tipo === "POSTULANTE"
          ? "postulante"
          : undefined,
  };
}

export function logout() {
  state.user = null;
}

export async function fetchStudentCode(): Promise<string> {
  const res = await api.get("/api/estudiantes/codigo-vinculacion/me");
  return res.data.data;
}

export async function fetchPostulanteCodigo(): Promise<string> {
  const response = await api.get("/api/postulantes/codigo-vinculacion/me");
  return response.data.data ?? response.data;
}

export function updateCareerSuggestion(career: string) {
  if (state.user?.role === "postulante") {
    state.user.careerSuggestion = career;

    localStorage.setItem("nexus_vocational_result", career);
  }
}

export async function linkStudent(codigo: string): Promise<boolean> {
  try {
    await api.post("/api/familiar/vincular", { codigo });

    await refreshFamiliarProfile();
    return true;
  } catch (error) {
    console.error("Error al vincular estudiante:", error);
    return false;
  }
}

export async function unlinkStudent(): Promise<boolean> {
  try {
    await api.post("/api/familiar/desvincular");

    await refreshFamiliarProfile();
    return true;
  } catch (error) {
    console.error("Error al desvincular estudiante:", error);
    return false;
  }
}

export function useAuth() {
  return {
    state,
    login,
    loginWithGoogle,
    logout,
    updateCareerSuggestion,
    refreshFamiliarProfile,
    fetchFamiliarProfile,
    fetchStudentCode,
    linkStudent,
    unlinkStudent,
  };
}
