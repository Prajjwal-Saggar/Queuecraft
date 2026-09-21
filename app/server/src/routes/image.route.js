const {
    jobPostController,
    getJobById,
    getAllJobs,
} = require("../controller/image.controller");


const imageRoute = async (fastify, options) => {
    fastify.post("/", jobPostController);
    fastify.get("/:id", getJobById);
    fastify.get("/", getAllJobs);

};


module.exports = imageRoute;