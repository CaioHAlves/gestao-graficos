import { Controller, Body, Path, Patch, Route, Tags } from 'tsoa'
import { Stores } from '../../models/stores'
import { IStores } from '../interfaces/stores'
import { Groups } from '../../models/groups'
import { ObjectId } from 'mongodb'
import { Response } from '../interfaces/response'

@Tags("Stores")
@Route('stores')
export class PatchStores extends Controller {

  @Patch("/update/{id}")
  static async patchStores(@Path() id: string, @Body() body: IStores): Promise<Response<{ store: IStores }>> {

    if (!id) {
      return {
        code: 422,
        message: "O ID da loja não foi informado"
      }
    }

    return Stores.findByIdAndUpdate({ _id: id }, {
      $addToSet: {
        gruposVinculados: { $each: body.gruposVinculados },
        codLoja: body.codLoja,
        nomeLoja: body.nomeLoja,
        responsavel: body.responsavel
      }
    }, { new: true })
      .then(async storeUpdated => {

        if (body.gruposVinculados !== undefined) {
          const groupsUpdate = body.gruposVinculados?.map((group) => ({
            updateOne: {
              filter: { _id: new ObjectId(group.id) },
              update: {
                $addToSet: {
                  lojasVinculadas: {
                    id: storeUpdated!._id.toString(),
                    codLoja: storeUpdated!.codLoja,
                    nomeLoja: storeUpdated!.nomeLoja
                  }
                }
              }
            }
          }))
  
          await Groups.bulkWrite(groupsUpdate)
        }

        return {
          code: 200,
          message: "Dados alterados com sucesso",
          store: storeUpdated
        }
      })
      .catch((err) => {
        return {
          code: 422,
          message: "Não foi possivel alterar dados da loja",
          error: err
        }
      })
  }
}