import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const projectSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true
        },
        collaborators: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        audio_participants: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        shareSlug: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

projectSchema.plugin(mongooseAggregatePaginate)

export const Project = mongoose.model("Project", projectSchema)

