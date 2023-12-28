import mongoose, {Schema} from "mongoose";

const movieSchema = new Schema(
    {
        title:{
            type: String
        },
        publishing_year:{
            type: Number,
            default: 0
        },
        image:{
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;