import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apierror.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APIresponse.js";
const registerUser=asyncHandler(async(req,res)=>
{
    // get user details from frontend
    //validation-not empty
    //check if user already exists:username,email
    //check for images,check for avatar
    //upload them to cloudinary,avatar
    //create user object-create entry in db
    // remove password and refresh token field from response
    //check for user creation 
    //return response 

    const {fullname,email,username,password}=req.body
    console.log("email:",email);

    if (
        [fullname,email,username,password].some((field)=>
            field?.trim()==="")
    ) {
        throw new apiError(400,"All fields are required")
    }
    const existedUser=await User.findOne({
        $or:[{ username },{ email }]
    })
    if (existedUser) {
        throw new apiError(409,"User with email and username already exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new apiError(400,"Avatar is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new apiError(400,'Avatar file is required')
    }
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url ||"",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser)
    {
        throw new apiError(500,"Something went wrong ehile registering the user")
    }
    return res.status(201).json(
    new ApiResponse(
        201,
        createdUser,
        "User registered"
    )
)
})  
export {registerUser}