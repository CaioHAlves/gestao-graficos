import { Get, Controller, Route, Tags, Query } from 'tsoa'
import { Groups } from '../../models/groups'
import { Response } from '../interfaces/response'
import { IGroups } from '../interfaces/groups'
import { paginatorReturn } from '../../utils/paginatorReturn'

@Route("groups")
@Tags("Groups")
export class GetGroups extends Controller {
  @Get("/get")
  static async getGroups(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() nomeGrupo?: string,
    @Query() codGrupo?: string,
    @Query() nomeResponsavel?: string,
  ):Promise<Response<{ groups: Array<IGroups> }>> {

    let filter: { [key: string]: any } = {}

    if (nomeGrupo) {
      filter["nomeGrupo"] = nomeGrupo
    }
    if (codGrupo) {
      filter["codGrupo"] = codGrupo
    }
    if (nomeResponsavel) {
      filter["responsavel.nome"] = nomeResponsavel
    }

    return Groups.find(filter)
      .then(res => {
        console.log(res)
        return {
          code: 200,
          groups: paginatorReturn({ array: res, page, limit })
        }
      })
      .catch((err) => {
        return {
          code: 404,
          message: "Erro ao recuperar grupos",
          error: err
        }
      })
  }
}