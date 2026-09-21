const healthRoute = async (fastify, options) => {
  fastify.get("/", async (req, res) => {
    try {
      return res
        .code(200)
        .send({ message: "Service is up and running", status: "SUCCESS" });
    } catch (error) {
      return res.code(503).send({
        errorType: "Service Unavailable",
        errorMessage: error.message,
        status: "FAILURE",
      });
    }
  });
};

module.exports = healthRoute;
