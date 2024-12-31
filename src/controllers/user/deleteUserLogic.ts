import { Path, Route, Delete, Controller, Tags } from 'tsoa'
import { User } from '../../models/user'
import { Response } from '../interfaces/response'

@Route('users')
@Tags('Users')
export class DeleteUserLogic extends Controller {
  @Delete('/delete/{id}')
  static async deleteUserLogic(@Path() id: string): Promise<Response> {
    return User.findOneAndUpdate({ _id: id }, { ativo: false })
      .then((user) => {
        if (!user) {
          return {
            message: "Usuário não encontrado",
            code: 404
          }
        }

        return {
          message: "Usuário deletado",
          code: 200
        }
      })
      .catch((error) => {
        return {
          message: "Erro ao deletar usuário. Conexão não estabelecida com o servidor.",
          code: 500,
          error
        }
      })
  }
}