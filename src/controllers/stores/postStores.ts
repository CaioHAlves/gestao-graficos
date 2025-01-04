import { Controller, Route, Post, Body, Tags } from 'tsoa'
import { Stores } from '../../models/stores'
import { Response } from '../interfaces/response'
import { IStores } from '../interfaces/stores'
import { Groups } from '../../models/groups'
import { ObjectId } from 'mongodb'

@Tags("Stores")
@Route('stores')
export class PostStores extends Controller {

  @Post("/create")
  static async postStores(@Body() body: IStores): Promise<Response<{ id: string }>> {
    return Stores.create(body)
      .then(async storeCreated => {

        if (body.gruposVinculados !== undefined) {
          const groupsUpdate = body.gruposVinculados?.map((group) => ({
            updateOne: {
              filter: { _id: new ObjectId(group.id) },
              update: {
                $addToSet: {
                  lojasVinculadas: {
                    id: storeCreated!._id.toString(),
                    codLoja: storeCreated!.codLoja,
                    nomeLoja: storeCreated!.nomeLoja
                  }
                }
              }
            }
          }))
  
          await Groups.bulkWrite(groupsUpdate)
        }

        return {
          code: 201,
          message: "Create",
          id: storeCreated._id
        }
      })
      .catch((err) => {
        return {
          code: 422,
          message: "Não foi possivel criar loja",
          error: err
        }
      })
  }
}