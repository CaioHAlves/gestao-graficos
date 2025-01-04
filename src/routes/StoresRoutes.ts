import { Router } from 'express'

import { PostStores } from '../controllers/stores/postStores'
import { PatchStores } from '../controllers/stores/patchStores'

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

export default router