import { Controller, Path, Route, Tags, Body, Patch } from 'tsoa'
import { User } from '../../models/user'
import { UpdateUserRequest } from '../interfaces/user'
import { Response } from '../interfaces/response'

@Route("users")
@Tags("Users")
export class UserPatch extends Controller {
  @Patch("/patch/{id}")
  static async patch(@Path() id: string, @Body() body: UpdateUserRequest): Promise<Response<{ user?: UpdateUserRequest }>> {
    return User.findOne({ emailAcesso: body.emailAcesso, _id: id })
      .then((existUser) => {
        if (existUser && existUser.id !== id) {
          return {
            message: "Já existe um usuário com esse email",
            code: 422,
            error: "Unprocessable Entity",
            data: null
          }
        }

        return User.findByIdAndUpdate({ _id: id }, body)
          .then(() => {
            return {
              code: 200,
              message: "Dados alterados com sucesso",
              user: body
            }
          })
          .catch((err) => {
            return {
              code: 500,
              message: "Erro ao atualizar usuário",
              error: err
            }
          })
      })
      .catch(err => {
        return {
          code: 500,
          message: "Erro ao atualizar usuário",
          error: err
        }
      })
  }
}