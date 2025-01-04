import { Controller, Post, Body, Route, Tags } from 'tsoa'
import { User } from '../../models/user'
import { ICreateUserRequest } from '../interfaces/user'
import { Response } from '../interfaces/response'

@Route("users")
@Tags("Users")
export class UserCreate extends Controller {
  @Post('/create')
  static async create(@Body() body: ICreateUserRequest): Promise<Response<{ idUsuario: string }>> {
    
    const { emailAcesso } = body

    const existUser = await User.find({ emailAcesso })

    if (!emailAcesso) {
      return { message: "Um email é necessário para realizar o cadastro", code: 422 }
    }

    if (existUser.length > 0 && existUser[0].emailAcesso === emailAcesso) {
      return { message: "Já existe usuário com esse email", code: 422 }
    }

    const newUser = {
      ...body,
      linkFoto: "",
      ativo: true,
      gruposVinculados: [],
      lojasVinculadas: []
    }

    return User.create(newUser)
      .then((res) => {
        return {
          message: "Create",
          code: 200,
          idUsuario: res.id
        }
      })
      .catch((err) => {
        return {
          message: "Erro ao criar usuario",
          code: 422,
          error: err
        }
      })
  }
}