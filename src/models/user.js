import mongoose from "mongoose"
import timestamps from "mongoose-timestamp"
import { Collection } from "../common/constants/database_consts"

const Schema = mongoose.Schema

const User = new Schema({
    username: {
        type: String,
        index: true
    },
    password: String,
    name: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    versionKey: false
}, {
    collection: Collection.USER
})

User.plugin(timestamps)

export default mongoose.model("User", User)
