import mongoose from "mongoose"
import timestamps from "mongoose-timestamp"

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
    collection: "users"
})

User.plugin(timestamps)

export default mongoose.model("User", User)
