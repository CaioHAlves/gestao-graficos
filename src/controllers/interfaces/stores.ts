export interface IStores {
  nomeLoja: string
  codLoja: string
  responsavel: {
    nome: string
    id: string
  }
  gruposVinculados?: Array<{
    nomeGrupo: string
    codGrupo: string
    id: string
  }>
}