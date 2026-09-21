const Image = require("../model/image.model");
const mongoose = require("mongoose");
const fs = require("node:fs");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");
const { v4: uuidv4 } = require("uuid");
const jobPostController = async (req, res) => {
  try {
    const data = await req.file();

    if (!data) {
      return res.code(400).send({
        errorType: "Invalid Request",
        errorMessage: "Image file is required",
        status: "FAILURE",
      });
    }
    const originalFilename = data.filename;
    const extension = path.extname(originalFilename);
    const storedFilename = `${uuidv4()}${extension}`;
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      storedFilename,
    );
    await pipeline(data.file, fs.createWriteStream(uploadPath));
    const savedJob = await Image.create({ originalFilename, storedFilename });

    return res.code(201).send({
      savedJob: savedJob.toObject(),
      message: "Job saved successfully",
      status: "SUCCESS",
    });
  } catch (error) {
    res.code(500).send({
      errorType: "Failed to Create a Job",
      errorMessage: error.message,
      status: "FAILURE",
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
      return res.code(400).send({
        errorType: "Invalid Job ID",
        errorMessage: "The job ID is invalid",
        status: "FAILURE",
      });
    }

    const job = await Image.findById(_id);

    if (!job) {
      return res.code(404).send({
        errorType: "Job Not Found",
        errorMessage: "Job does not exist",
        status: "FAILURE",
      });
    }

    return res.code(200).send({
      job,
      message: "Job retrieved",
      status: "SUCCESS",
    });
  } catch (error) {
    res.code(500).send({
      errorType: "Failed to Get the Job",
      errorMessage: error.message,
      status: "FAILURE",
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Image.find().sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res
        .code(200)
        .send({
          jobs: [],
          message: "No jobs available at the moment",
          status: "SUCCESS",
        });
    }

    return res
      .code(200)
      .send({ jobs, message: "All jobs retrieved", status: "SUCCESS" });
  } catch (error) {
    res.code(500).send({
      errorType: "Failed to Fetch All Jobs",
      errorMessage: error.message,
      status: "FAILURE",
    });
  }
};

module.exports = { jobPostController, getJobById, getAllJobs };
