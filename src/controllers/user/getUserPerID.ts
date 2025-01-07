import { Controller, Get, Route, Tags, Path } from 'tsoa'
import { User } from '../../models/user'
import { IUser } from '../interfaces/user'
import { Response } from '../interfaces/response'
import { Groups } from '../../models/groups'
import { Stores } from '../../models/stores'

@Route('users')
@Tags('Users')
export class GetUserPerID extends Controller {
  @Get("/get/{id}")
  static async getUserPerID(@Path() id: string): Promise<Response<{ user?: IUser }>> {
    return User.findById(id)
      .then(async (user) => {
        if (!user) {
          return {
            message: "Usuário não encontrado",
            code: 404
          }
        }

        const { gruposVinculados, lojasVinculadas } = user

        const groups = !gruposVinculados.length ? [] : await Groups.find({ id: { $in: user.gruposVinculados } })
        const stores = !lojasVinculadas.length ? [] : await Stores.find({ id: { $in: user.lojasVinculadas } })

        const userDetails = {
          ...user.toObject(),
          gruposVinculados: groups.map(store => ({ nomeGrupo: store.nomeGrupo, codGrupo: store.codGrupo, id: store.id })),
          lojasVinculadas: stores.map(store => ({ nomeLoja: store.nomeLoja, codLoja: store.codLoja, id: store.id }))
        }

        return {
          code: 200,
          user: userDetails
        }
      })
      .catch((err) => {
        return {
          message: "Erro ao buscar usuário. Conexão não estabelecida com o servidor.",
          code: 500,
          error: err
        }
      })
  }
}