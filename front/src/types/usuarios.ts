export interface Usuario {
    email: string;
    password: string;
    nombre: string;
  }

export interface UsuarioLogin {
    email: string;
    password: string;
    access_token: string;
}
