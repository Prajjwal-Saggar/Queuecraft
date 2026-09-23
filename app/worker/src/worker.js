require("dotenv").config();
const path = require("node:path");
const fs = require("node:fs");
const sharp = require("sharp");
const { Worker } = require("bullmq");

const connectDB = require("./config/db");
const createRedisConnection = require("./config/redis.config");
const Image = require("./model/image.model");

const UPLOADS_DIR = path.join(__dirname, "..", "..", "server", "uploads");
const RESULTS_DIR = path.join(__dirname, "..", "results");

// make sure the results folder exists before we ever try to write to it
fs.mkdirSync(RESULTS_DIR, { recursive: true });

async function processImageJob(job) {
  const { jobId } = job.data;

  const imageDoc = await Image.findById(jobId);
  if (!imageDoc) {
    throw new Error(`No Image document found for id ${jobId}`);
  }

  imageDoc.status = "PROCESSING";
  await imageDoc.save();

  const inputPath = path.join(UPLOADS_DIR, imageDoc.storedFilename);
  const outputFilename = `resized-${path.parse(imageDoc.storedFilename).name}.jpg`;
  const outputPath = path.join(RESULTS_DIR, outputFilename);

  await sharp(inputPath)
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(outputPath);

  imageDoc.status = "DONE";
  imageDoc.resultUrl = outputFilename;
  await imageDoc.save();

  return { outputFilename };
}

async function start() {
  await connectDB();

  const worker = new Worker("image-processing", processImageJob, {
    connection: createRedisConnection(),
    concurrency: 2,
  });

  worker.on("completed", (job, result) => {
    console.log(`Job ${job.id} completed:`, result);
  });

  worker.on("failed", async (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message);

    try {
      const imageDoc = await Image.findById(job.data.jobId);
      if (imageDoc) {
        imageDoc.status = "FAILED";
        imageDoc.error = err.message;
        await imageDoc.save();
      }
    } catch (dbErr) {
      console.error(
        "Failed to update job status after failure:",
        dbErr.message,
      );
    }
  });

  console.log("Worker started, listening for jobs on 'image-processing' queue");
}

start();
