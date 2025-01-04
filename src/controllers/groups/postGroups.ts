import { Controller, Route, Post, Body, Tags } from 'tsoa'
import { Groups } from '../../models/groups'
import { Response } from '../interfaces/response'
import { IGroups } from '../interfaces/groups'
import { ObjectId } from 'mongodb'
import { Stores } from '../../models/stores'

@Tags("Groups")
@Route('groups')
export class PostGroup extends Controller {

  @Post("/create")
  static async postGroup(@Body() body: IGroups): Promise<Response<{ id: string }>> {
    return Groups.create(body)
      .then(async groupCreated => {

        if (body.lojasVinculadas !== undefined) {
          const storesUpdated = body.lojasVinculadas?.map((group) => ({
            updateOne: {
              filter: { _id: new ObjectId(group.id) },
              update: {
                $addToSet: {
                  gruposVinculados: {
                    id: groupCreated!._id.toString(),
                    codGrupo: groupCreated!.codGrupo,
                    nomeGrupo: groupCreated!.nomeGrupo
                  }
                }
              }
            }
          }))

          await Stores.bulkWrite(storesUpdated)
        }

        return {
          code: 201,
          message: "Create",
          id: groupCreated._id
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