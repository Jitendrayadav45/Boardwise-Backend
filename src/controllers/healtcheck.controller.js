import  ApiResponse  from "../utils/ApiResponse.js";
import  asyncHandler  from "../utils/asyncHandler.js";

const healtcheck = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, "success", " Health check passed"));
});

export default healtcheck ;
