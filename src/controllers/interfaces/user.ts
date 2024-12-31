export enum Funcao {
  COMPRADOR = "COMPRADOR",
  VISUALIZADOR = "VISUALIZADOR",
  ADMINISTRADOR = "ADMINISTRADOR"
}

export interface IUser {
  ativo: boolean,
  emailAcesso: string,
  funcao: Funcao,
  id: string,
  linkFoto: string,
  nome: string,
  responsavel: {
    id: string,
    nome: string
  },
  sobrenome: string,
  gruposVinculados: string[],
  LojasVinculadas: string[],
}
export type ICreateUserRequest = Omit<IUser, 'ativo' | 'id' | 'linkFoto'>

export type UpdateUserRequest = Omit<IUser, 'id'>