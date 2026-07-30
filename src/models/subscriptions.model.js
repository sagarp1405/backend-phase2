import mongoose,{ Schema } from "mongoose"

const subscriptionsSchema = new Schema({
    subscriber:
    {
        type:Schema.Types.ObjectId,//one who is subscribing
        ref:"User" 
    },
    channel:
    {
        type:Schema.Types.ObjectId,// one to whon we are going to subscribe
        ref:"User"
    }
},{timestamps:true})

export const Subscription=mongoose.model("Subscription",subscriptionsSchema)//1:41