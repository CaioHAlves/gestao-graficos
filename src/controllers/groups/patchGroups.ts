import { Controller, Body, Patch, Route, Tags, Path } from 'tsoa'
import { Groups } from '../../models/groups'
import { IGroups } from '../interfaces/groups'
import { Response } from '../interfaces/response'
import { Stores } from '../../models/stores'

@Route('groups')
@Tags("Groups")
export class PatchGroups extends Controller {
  @Patch("/patch/{id}")
  static async patchGroups(
    @Path() id: string,
    @Body() body: IGroups
  ): Promise<Response<{ group?: IGroups }>> {

    if (!id) {
      return {
        code: 422,
        message: 'ID do grupo não informado'
      }
    }

    try {
      const group = await Groups.findById({ _id: id })
  
      if (!group) {
        return {
          code: 404,
          message: 'Grupo não encontrado'
        }
      }
  
      if (body.lojasVinculadas) {
        // Obter os IDs das lojas antes da atualização
        const previousStoreIds = group.lojasVinculadas.map(store => store.id)
      
        // Atualizar as lojas vinculadas no grupo
        group.lojasVinculadas = body.lojasVinculadas.length
          ? group.lojasVinculadas.concat(body.lojasVinculadas).reduce((acc, current) => {
              if (!acc.some(item => item.id === current.id)) {
                acc.push(current)
              }
              return acc
            }, [] as typeof group.lojasVinculadas)
          : []
      
        // Obter os IDs das lojas após a atualização
        const currentStoreIds = group.lojasVinculadas.map(store => store.id)
      
        // Identificar as lojas removidas
        const removedStoreIds = previousStoreIds.filter(id => !currentStoreIds.includes(id))
      
        // Atualizar as lojas adicionando o grupo
        if (body.lojasVinculadas.length) {
          await Stores.updateMany(
            { _id: { $in: body.lojasVinculadas.map(store => store.id) } },
            {
              $addToSet: {
                gruposVinculados: {
                  id: group.id,
                  codGrupo: group.codGrupo,
                  nomeGrupo: group.nomeGrupo,
                }
              }
            }
          )
        }
      
        // Remover o grupo das lojas que foram desvinculadas
        if (removedStoreIds.length || !body.lojasVinculadas.length) {
          await Stores.updateMany(
            { _id: { $in: removedStoreIds }},
            {
              $pull: {
                gruposVinculados: { id: group.id },
              }
            }
          )
        }
      }

      group.codGrupo = body.codGrupo || group.codGrupo
      group.nomeGrupo = body.nomeGrupo || group.nomeGrupo
      group.responsavel = body.responsavel || group.responsavel

      await group.save()
  
      return {
        code: 200,
        message: 'Grupo alterado com sucesso',
        data: group
      }
    } catch (error) {
      return {
        code: 500,
        message: 'Erro interno no servidor',
        error
      }
    }
  }
}