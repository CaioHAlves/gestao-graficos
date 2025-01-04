import { Controller, Body, Patch, Route, Tags, Path } from 'tsoa'
import { Groups } from '../../models/groups'
import { IGroups } from '../interfaces/groups'
import { Response } from '../interfaces/response'
import { Stores } from '../../models/stores'
import { ObjectId } from 'mongodb'

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

    return Groups.findByIdAndUpdate({ _id: id }, {
      $addToSet: {
        lojasVinculadas: { $each: body.lojasVinculadas },
        codGrupo: body.codGrupo,
        nomeGrupo: body.nomeGrupo,
        responsavel: body.responsavel
      },
    }, { new: true })
      .then(async groupUpdated => {

        if (body.lojasVinculadas !== undefined) {
          const storesUpdated = body.lojasVinculadas?.map((group) => ({
            updateOne: {
              filter: { _id: new ObjectId(group.id) },
              update: {
                $addToSet: {
                  gruposVinculados: {
                    id: groupUpdated!._id.toString(),
                    codGrupo: groupUpdated!.codGrupo,
                    nomeGrupo: groupUpdated!.nomeGrupo
                  }
                }
              }
            }
          }))

          await Stores.bulkWrite(storesUpdated)
        }

        return {
          code: 200,
          message: 'Grupo alterado com sucesso',
          group: body
        }
      })
      .catch((err) => {
        return {
          code: 500,
          error: err,
          message: 'Erro ao alterar grupo. Conexão com o servidor não estabelecida'
        }
      })
  }
}