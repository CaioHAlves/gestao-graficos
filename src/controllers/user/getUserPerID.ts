import { Controller, Get, Route, Tags, Path } from 'tsoa'
import { User } from '../../models/user'
import { IUser } from '../interfaces/user'

interface IResponse {
  message?: string
  code: number
  user?: IUser
  error?: any
}

@Route('users')
@Tags('Users')
export class GetUserPerID extends Controller {
  @Get("/get/{id}")
  static async getUserPerID(@Path() id: string): Promise<IResponse> {
    return User.findById(id)
      .then((user) => {
        if (!user) {
          return {
            message: "Usuário não encontrado",
            code: 404
          }
        }

        return {
          code: 200,
          user: user.toObject() as IUser
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