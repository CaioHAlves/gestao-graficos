import { Router } from 'express'

import { PostGroup } from '../controllers/groups/postGroups'
import { PatchGroups } from '../controllers/groups/patchGroups'

const router = Router()

router.post("/create", (req, res) => {
  PostGroup.postGroup(req.body)
    .then((group) => res.status(group.code).json(group))
    .catch((err) => res.status(err.code).json(err))
})

router.patch("/patch/:id", (req, res) => {
  PatchGroups.patchGroups(req.params.id, req.body)
    .then((group) => res.status(group.code).json(group))
    .catch((err) => res.status(err.code).json(err))
})

export default router