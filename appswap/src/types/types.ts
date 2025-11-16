export interface App {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  url_aplicacion: string;
  imagen_portada?: string;
  precio: number;
  url_video?: string;
}

export interface Payment {
  id: number;
  aplicacion_id: number;
  comprador_id: number;
  estado: 'pendiente' | 'confirmado';
  codigo_qr: string;
  credenciales?: string;
}

export interface Review {
  id: number;
  aplicacion_id: number;
  autor_id: number;
  calificacion: number;
  comentario: string;
}

export interface Stats {
  appId: number;
  descargas: number;
  resenas: number;
  calificacion_promedio: number;
  pagos_recibidos: number;
}

export interface Recommendation {
  id: number;
  usuario_id: number;
  idea: string;
}
