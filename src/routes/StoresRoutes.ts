import { Router } from 'express'

import { PostStores } from '../controllers/stores/post'

const router = Router()

router.post("/create", (req, res) => {
  PostStores.postStores(req.body)
    .then((store) => res.status(store.code).json(store))
    .catch((err) => res.status(err.code).json(err))
})

export default router