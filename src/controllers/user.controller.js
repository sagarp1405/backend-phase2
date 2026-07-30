import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apierror.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APIresponse.js";
import jwt from "jsonwebtoken"
const generateAccessandRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateaccesstoken()
        const refreshToken=user.generaterefreshtoken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new apiError(500,"Something went wrong while generating refresh and access tokens")
    }
}
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
    console.log(req.body);
    console.log(req.files);

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
    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0) {
        coverImageLocalPath=req.files.coverImage[0].path
    }
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
const loginUser=asyncHandler(async(req,res)=>{
    console.log(req.body)
    // req body->data
    //username or email based access
    //find the user
    //password check
    //access and refresh token 
    //send cookies
    const {email,username,password}=req.body
    if (!(username || email)) {
        throw new apiError(400,"Email or username is required")
    }
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if (!user) {
        throw new apiError(404,"User does not exist")
    }
    const isPasswordValid=await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new apiError(401,"Invalid User Credentials")
    }
    const {accessToken,refreshToken}=await generateAccessandRefreshTokens(user._id)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged in Successfully"
        )
    )
})
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))
})
const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken|| req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new apiError(401,"Unauthorised request")
    }
    try {
        const decodedtoken= jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user=await User.findById(decodedtoken?._id)
        if (!user) {
            throw new apiError(401,"Invalid refreshtoken")
        }
        if(incomingRefreshToken!==user?.refreshToken)
        {
            throw new apiError(401,"Refresh token is expired or used ")
        }
        const options={
                httpOnly:true,
                secure:true
        }
        const{accessToken,refreshToken:newrefreshToken}=await generateAccessandRefreshTokens(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newrefreshToken},
                "Access token refreshed successfully"
            )
        )
    } catch (error) {
        throw new apiError(401,error?.message||"Invalid refresh token")
    }
})
export {registerUser, loginUser,logoutUser,refreshAccessToken}