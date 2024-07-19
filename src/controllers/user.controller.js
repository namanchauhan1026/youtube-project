import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponnse.js";


const registerUser = asyncHandler(async (req, res) => {
    //    res.status(200).json({
    //     message: "ok"
    //    })
    // steps---
    // get user details from frentend
    // validation on inputs -not empty
    // check if user is already exits : username and email
    // check for images and avatar
    // upolad them in cloudinary, avator
    // create user object - create entry in db
    // remove pass and refesh token field
    // check for user creation 
    // return response if created
    
    // check for empty input
    const { fullName, email, username, password } = req.body
    console.log("email:", email);

    if (
        [fullName, email, username, password].some( (field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fiels are required")
    }

   // checking already exits user
    const exitedUser =  User.findOne({
        $or: [{username}, {email}]
    })

    if(exitedUser){
        throw new ApiError(409, "User already Exits")
    }
    // checking for avatar file 
    const avatarLocalPath =  req.files?.avatar[0]?.path
    const coverImageLocalPath =  req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    //upolad them in cloudinary, avator
   const avatar =  await uploadOnCloudinary(avatarLocalPath)
   const coverImage =  await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400, "Avatar file is required to upload in cloudinary")
   }

   // create user object - create entry in db
   
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
   })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Someting went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered succesfully")
    )

})

export {
    registerUser,
}