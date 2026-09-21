const app = require("fastify")({
  logger: true,
});

app.register(require("@fastify/multipart"));

const healthRoute = require("./routes/health.route");
const imageRoute = require("./routes/image.route");

app.register(imageRoute, {
  prefix: "/api/v0/job",
});

app.register(healthRoute, { prefix: "/api/v0/health" });

module.exports = app;
