import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            sparse: true, // lets multiple documents leave a unique field empty without colliding
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            sparse: true,
            lowecase: true,
            trim: true
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        displayName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.plugin(mongooseAggregatePaginate)

export const User = mongoose.model("User", userSchema)
