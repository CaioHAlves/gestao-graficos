import { Controller, Get, Route, Tags, Query } from 'tsoa';
import { User } from '../../models/user';
import { Funcao, IUser } from '../interfaces/user';
import { SortOrder } from 'mongoose';
import { Response } from '../interfaces/response';
import { paginatorReturn } from '../../utils/paginatorReturn';

type Item = Omit<IUser, "gruposVinculados" | "LojasVinculadas" | "ativo" | "responsavel">

interface GetUsersResponse {
  items: Array<Item>
  totalPages: number
}

@Route('users')
@Tags('Users')
export class GetUsers extends Controller {
  @Get('/get')
  static async getUsers(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() nome?: string,
    @Query() emailAcesso?: string,
    @Query() funcao?: Funcao,
    @Query() ativo?: boolean,
    @Query() sort?: string,
    @Query() direction?: 'asc' | 'desc'
  ): Promise<Response<GetUsersResponse>> {

    let filter: { [key: string]: string | Funcao | boolean } = {}

    if (nome) {
      filter["nome"] = nome
    }
    if (emailAcesso) {
      filter["emailAcesso"] = emailAcesso
    }
    if (funcao) {
      filter["funcao"] = funcao
    }
    if (ativo) {
      filter["ativo"] = ativo
    }

    let sortObject: { [key: string]: SortOrder } = {}
    if (sort) {
      const sortFields = sort.split(',')
      const directionFields = direction ? direction.split(',') : []

      sortFields.forEach((field, index) => {
        const dir = directionFields[index] === 'desc' ? -1 : 1
        sortObject[field.trim()] = dir
      });
    }

    return User.find(filter).sort(sortObject)
      .then((users) => {
        const list: Array<Item> = paginatorReturn<Item>({
          array: users.map(user => ({
            id: user.id,
            emailAcesso: user.emailAcesso,
            funcao: user.funcao as Funcao,
            linkFoto: user.linkFoto || "",
            nome: user.nome,
            sobrenome: user.sobrenome,
            lojasVinculadas: user.lojasVinculadas,
            gruposVinculados: user.gruposVinculados
          })),
          page,
          limit
        })
  
        const totalPages = Math.ceil(list.length / (limit || 10))
  
        return {
          items: list,
          totalPages: totalPages,
          message: '',
          code: 200,
        }
      })
      .catch((err) => {
        return {
          items: [],
          totalPages: 0,
          message: "Erro ao buscar usuários. Conexão não estabelecida com o servidor.",
          code: 500,
          error: err
        }
      })
  }
}
