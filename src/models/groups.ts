import mongoose from "../db/conn"

const { Schema } = mongoose

export const Groups = mongoose.model(
  'Groups',
  new Schema({
    nomeGrupo: {
      type: String,
      require: true
    },
    codGrupo: {
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
    lojasVinculadas: {
      type: [{
        nomeLoja: {
          type: String,
          require: true
        },
        codLoja: {
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
  }, 
  { 
    timestamps: false, 
    versionKey: false 
  })
  .set("toJSON", {
    transform: (_, ret) => {
      ret.id = ret._id
    }
  })
)