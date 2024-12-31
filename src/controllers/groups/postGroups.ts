import { Controller, Route, Post, Body, Tags } from 'tsoa'
import { Groups } from '../../models/groups'
import { Response } from '../interfaces/response'
import { IGroups } from '../interfaces/groups'

@Tags("Groups")
@Route('groups')
export class PostGroup extends Controller {

  @Post("/create")
  static async postGroup(@Body() body: IGroups): Promise<Response<{ id: string }>> {
    return Groups.create(body)
      .then(res => {
        return {
          code: 201,
          message: "Create",
          id: res._id
        }
      })
      .catch((err) => {
        return {
          code: 422,
          message: "Não foi possivel criar grupo",
          error: err
        }
      })
  }
}