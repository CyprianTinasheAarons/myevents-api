const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Meal =  new Schema (
    {
        Title: {
            type: String
        },
        Recipe: {
            type: String
        },
        Chef: {
            type: String
        }

    } ,
    {
        collection:'meals'
    }
)

module.exports = mongoose.model('Meal ', Meal )

