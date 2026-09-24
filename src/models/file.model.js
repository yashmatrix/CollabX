import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const fileSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project"
        },
        filename: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

fileSchema.plugin(mongooseAggregatePaginate)

export const File = mongoose.model("File", fileSchema)