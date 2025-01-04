import express, { urlencoded, json } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from '../swagger/swagger.json'

import UserRoutes from './routes/UserRoutes'
import GroupsRoutes from './routes/GroupsRoutes'
import StoresRoutes from './routes/StoresRoutes'

const whitelist: Array<string | undefined> = []
const port = Number(process.env.PORT!)

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(cors({
  origin: process.env.AMBIENT !== "production" ? "*" : (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  credentials: true
}))

app.use("/users", UserRoutes)
app.use("/groups", GroupsRoutes)
app.use("/stores", StoresRoutes)

// Block swagger in production 
if (process.env.AMBIENT !== "production") {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      tagsSorter: "alpha",
      version: 3,
      docExpansion: "none",
      syntaxHighlight: false
    }
  }));
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});