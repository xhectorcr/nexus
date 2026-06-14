// Mapeo de Entidades del Backend (Spring Boot)

export interface CarreraUniversitaria {
  id: number;
  nombre: string;
  facultad: string;
  descripcion: string;
  campoLaboral: string;
  salarioPromedio?: number;
}

export interface SugerenciaCarrera {
  carrera: CarreraUniversitaria;
  porcentajeAfinidad: number;
  justificacion: string;
}

export interface PerfilarResponse {
  sugerencias: SugerenciaCarrera[];
}

export interface BitacoraEntrada {
  id?: number;
  titulo: string;
  descripcion: string;
  tipoEntrada: 'EXPERIENCIA' | 'REFLEXION' | 'DECISION' | 'LOGRO' | 'MIEDO';
  fecha?: string;
}

export interface Mision {
  id: number;
  titulo: string;
  descripcion: string;
  recompensaXp: number;
  completada: boolean;
}

export interface ResultadoLaberinto {
  id: number;
  fecha: string;
  tiempoSegundos: number;
  precision: number;
  decisionClave: string;
}

export interface PerfilPostulante {
  id: number;
  cuestionarioCompletado: boolean;
  laboratorioActivo: boolean;
  entradasBitacora: BitacoraEntrada[];
  resultadosLaberinto: ResultadoLaberinto[];
  misiones: Mision[];
}

export interface PublicacionForo {
  id: number;
  autorId: number;
  autorNombre: string;
  autorRol: string;
  contenido: string;
  fechaPublicacion: string;
  respuestas: number;
}

export interface ConexionP2P {
  id: number;
  estudianteId: number;
  postulanteId: number;
  estado: 'PENDIENTE' | 'ACTIVA' | 'FINALIZADA';
}
