import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchemeType = new Schema({
  name: {
    type: String,

    required: true,
  },

  status: {
    type: String,

    required: true,
  },
});

export default mongoose.model("categories", CategorySchemeType);
