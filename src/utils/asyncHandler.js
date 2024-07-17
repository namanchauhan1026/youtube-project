const asyncHandler = (reqestHandler) => {
     (req, res, next) =>{
        Promise.resolve(reqestHandler(req, res, next)).
        catch((err) => next(err))
     }
}

export {asyncHandler}









// const asyncHandler = (fn) => async (req, res, next) =>{
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.ststus(rrr.code || 500).json({
//             success: false,
//             message: error.message
//         })
        
//     }
// }