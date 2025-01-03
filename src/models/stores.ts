import mongoose from "../db/conn"

const { Schema } = mongoose

export const Stores = mongoose.model(
  'Stores',
  new Schema({
    nomeLoja: {
      type: String,
      require: true
    },
    codLoja: {
      type: String,
      require: true
    },
    responsavel: {
      type: {
        nome: {
          type: String,
          require: true
        },
        id: {
          type: String,
          require: true
        }
      },
      _id: false,
      require: true
    },
    gruposVinculados: {
      type: [{
        nomeGrupo: {
          type: String,
          require: true
        },
        codGrupo: {
          type: String,
          require: true
        },
        id: {
          type: String,
          require: true
        }
      }],
      _id: false
    }
  }, { timestamps: false, versionKey: false })
)