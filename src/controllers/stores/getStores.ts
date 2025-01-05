import { Get, Controller, Route, Tags, Query } from 'tsoa'
import { Stores } from '../../models/stores'
import { Response } from '../interfaces/response'
import { IStores } from '../interfaces/stores'
import { paginatorReturn } from '../../utils/paginatorReturn'

@Route("stores")
@Tags("Stores")
export class GetStores extends Controller {
  @Get("/get")
  static async getStores(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() nomeLoja?: string,
    @Query() codLoja?: string,
    @Query() nomeResponsavel?: string,
  ):Promise<Response<{ stores: Array<IStores> }>> {

    let filter: { [key: string]: any } = {}

    if (nomeLoja) {
      filter["nomeLoja"] = nomeLoja
    }
    if (codLoja) {
      filter["codLoja"] = codLoja
    }
    if (nomeResponsavel) {
      filter["responsavel.nome"] = nomeResponsavel
    }

    return Stores.find(filter)
      .then(res => {
        return {
          code: 200,
          stores: paginatorReturn({ array: res, page, limit })
        }
      })
      .catch((err) => {
        return {
          code: 404,
          message: "Erro ao recuperar lojas",
          error: err
        }
      })
  }
}