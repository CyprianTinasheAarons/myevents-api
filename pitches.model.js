const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Pitch =  new Schema (
    {
        Title: {
            type: String
        },
      
        Description: {
            type: String
        },
        Owner: {
            type: String
        }

    } ,
    {
        collection:'pitches'
    }
)

module.exports = mongoose.model('Pitch ', Pitch )

