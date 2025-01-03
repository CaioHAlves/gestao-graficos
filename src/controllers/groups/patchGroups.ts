import { Controller, Body, Patch, Route, Tags, Path } from 'tsoa'
import { Groups } from '../../models/groups'
import { IGroups } from '../interfaces/groups'
import { Response } from '../interfaces/response'

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

    return Groups.findByIdAndUpdate({ _id: id }, body)
      .then(res => {
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