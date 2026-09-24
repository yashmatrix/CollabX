import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const messageSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project"
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

messageSchema.plugin(mongooseAggregatePaginate)

export const Message = mongoose.model("Message", messageSchema)

