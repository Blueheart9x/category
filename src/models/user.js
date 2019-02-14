import mongoose from "mongoose"
import timestamps from "mongoose-timestamp"
import DataUtils from "../utils/data_utils"
import { Collection } from "../common/constants/database_consts"

const Schema = mongoose.Schema

const User = new Schema({
    username: {
        type: String,
        index: true,
        validate: {
            validator: username => {
                return DataUtils.isValidUsername(username)
            },
            message: props => `${props.value} is not a valid username!`
        },
        required: [true, "username required"]
    },
    password: String,
    name: {
        type: String,
        validate: {
            validator: name => {
                return DataUtils.isValidName(name)
            },
            message: props => `${props.value} is not a valid name!`
        },
        required: [true, "name required"]
    },
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
