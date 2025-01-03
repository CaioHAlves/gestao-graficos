export interface IGroups {
  nomeGrupo: string
  codGrupo: string
  responsavel: {
    nome: string
    id: string
  }
  lojasVinculadas?: Array<{
    nomeLoja: string
    codLoja: string
    id: string
  }>
}