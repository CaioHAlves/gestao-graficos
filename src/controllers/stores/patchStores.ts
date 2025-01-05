import { Controller, Body, Path, Patch, Route, Tags } from 'tsoa'
import { Stores } from '../../models/stores'
import { IStores } from '../interfaces/stores'
import { Groups } from '../../models/groups'
import { Response } from '../interfaces/response'

@Tags("Stores")
@Route('stores')
export class PatchStores extends Controller {

  @Patch("/patch/{id}")
  static async patchStores(@Path() id: string, @Body() body: IStores): Promise<Response<{ store: IStores }>> {

    if (!id) {
      return {
        code: 422,
        message: "O ID da loja não foi informado"
      }
    }

    return Stores.findById({ _id: id })
      .then(async store => {

        if (!store) {
          return {
            code: 404,
            message: "Loja não encontrada"
          }
        }

        store.nomeLoja = body.nomeLoja || store.nomeLoja
        store.codLoja = body.codLoja || store.codLoja
        store.responsavel = body.responsavel || store.responsavel

        if (body.gruposVinculados) {
          const previousGroupIds = store.gruposVinculados.map(group => group.id)

          store.gruposVinculados = body.gruposVinculados.length
            ? store.gruposVinculados.concat(body.gruposVinculados).reduce((acc, current) => {
              if (!acc.some(item => item.id === current.id)) {
                acc.push(current)
              }
              return acc
            }, [] as typeof store.gruposVinculados)
            : []

          const currentGroupIds = store.gruposVinculados.map(group => group.id)

          const removedGroupIds = previousGroupIds.filter(id => !currentGroupIds.includes(id))

          if (body.gruposVinculados.length) {
            await Groups.updateMany(
              { _id: { $in: body.gruposVinculados.map(group => group.id) } },
              {
                $addToSet: {
                  lojasVinculadas: {
                    id: store.id,
                    nomeLoja: store.nomeLoja,
                    codLoja: store.codLoja
                  }
                }
              }
            )
          }

          if (removedGroupIds.length || !body.gruposVinculados.length) {
            await Groups.updateMany(
              { _id: { $in: removedGroupIds.map(id => id) } },
              {
                $pull: {
                  lojasVinculadas: {
                    id: store.id
                  }
                }
              }
            )
          }
        }

        await store.save()

        return {
          code: 200,
          message: "Loja atualizada com sucesso",
          data: store
        }
      })
      .catch(error => {
        return {
          code: 500,
          message: "Erro ao atualizar loja",
          error
        }
      })
  }
}