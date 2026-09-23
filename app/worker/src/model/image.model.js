const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    originalFilename: {
      type: String,
      required:true 
    },
    storedFilename: {
      type: String,
      required:true 
    },
    resultUrl: {
      type: String,
      default:null
    },
    error: {
      type: String,
      default:null
    },
    status: {
      type: String,
      enum: ["UPLOADED", "QUEUED", "PROCESSING", "DONE", "FAILED"],
      default: "UPLOADED",
    },
  },
  { timestamps: true },
);

const Image = mongoose.model("image", ImageSchema);

module.exports = Image;
