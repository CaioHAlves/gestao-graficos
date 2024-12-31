import { Funcao } from '../controllers/interfaces/user'
import mongoose from '../db/conn'

const { Schema } = mongoose

export const User = mongoose.model(
  "Users",
  new Schema({
    nome: {
      type: String,
      required: true
    },
    emailAcesso: {
      type: String,
      required: true
    },
    funcao: {
      type: String,
      enum: Funcao,
      required: true
    },
    responsavel: {
      type: {
        id: {
          type: String,
          require: true
        },
        nome: {
          type: String,
          require: true
        }
      },
      _id: false,
      required: true
    },
    sobrenome: {
      type: String,
      required: true
    },
    ativo: {
      type: Boolean,
      required: true
    },
    linkFoto: {
      type: String
    },
    gruposVinculados: {
      type: [String],
      default: []
    },
    lojasVinculadas: {
      type: [String],
      default: []
    }
  },
  { timestamps: false, versionKey: false },
  )
)