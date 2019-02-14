import mongoose from "mongoose"
import timestamps from "mongoose-timestamp"
import DataUtils from "../../utils/data_utils"
import { Collection } from "../../common/constants/database_consts"

const Schema = mongoose.Schema

const FunctionGroup = new Schema({
    code: {
        type: String,
        index: true,
        validate: {
            validator: code => {
                return DataUtils.isValidCode(code)
            },
            message: props => `${props.value} is not a valid code!`
        },
        required: [true, "code required"]
    },
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
    description: {
        type: String,
        validate: {
            validator: description => {
                return DataUtils.isValidCommonText(description)
            },
            message: props => `${props.value} is not a valid description!`
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    versionKey: false
}, {
    collection: Collection.FUNCTION_GROUP
})

FunctionGroup.plugin(timestamps)

export default mongoose.model("FunctionGroup", FunctionGroup)
