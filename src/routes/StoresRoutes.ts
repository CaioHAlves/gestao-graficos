import { Router } from 'express'

import { PostStores } from '../controllers/stores/postStores'
import { PatchStores } from '../controllers/stores/patchStores'
import { GetStores } from '../controllers/stores/getStores'
import { IParamsGetStores } from './Interfaces/interfacesStoresRoutes'

const router = Router()

router.post("/create", (req, res) => {
  PostStores.postStores(req.body)
    .then((store) => res.status(store.code).json(store))
    .catch((err) => res.status(err.code).json(err))
})

router.patch("/patch/:id", (req, res) => {
  PatchStores.patchStores(req.params.id, req.body)
    .then((store) => res.status(store.code).json(store))
    .catch((err) => res.status(err.code).json(err))
})

router.get("/get", (req, res) => {

  const params = req.query as IParamsGetStores

  GetStores.getStores(params.page, params.limit, params.nomeLoja, params.codLoja, params.nomeResponsavel)
    .then(store => res.status(store.code).json(store))
    .catch(error => res.status(error.code).json(error))
})

export default router