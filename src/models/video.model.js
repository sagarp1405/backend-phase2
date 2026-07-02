import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2"
const videoSchema=new Schema({
    videoFile:
    {
        type:Sting,//cloudinary url
        required:true
    },
    thubnail:
    {
        type:Sting,//cloudinary url
        required:true 
    },
    title:
    {
        type:Sting,//cloudinary url
        required:true 
    },
    title:
    {
        type:Sting,
        required:true 
    },
    description:
    {
        type:Sting,
        required:true 
    },
    duration:
    {
        type:Number,//cloudinary url
        required:true 
    },
    views:
    {
        type:Number,
        default:0 
    },
    isPublished:
    {
        type:Boolean,
        deafualt:true
    },
    owner:
    {
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true}
)
videoSchema.plugin(mongooseAggregatePaginate)
export const Video =mongoose.model("Video",videoSchema)
//6:41