const app = require("fastify")({
  logger: true,
});
const cors  = require('@fastify/cors')
app.register(require("@fastify/multipart"));


app.register(cors, {
 origin: 'http://localhost:5173',
  credentials: true,

})
const healthRoute = require("./routes/health.route");
const imageRoute = require("./routes/image.route");

app.register(imageRoute, {
  prefix: "/api/v0/job",
});

app.register(healthRoute, { prefix: "/api/v0/health" });

module.exports = app;
