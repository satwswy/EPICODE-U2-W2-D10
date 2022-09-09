import mongoose from "mongoose"

const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Host", "Guest"], default: "Guest" },
  },
  {
    timestamps: true, 
  }
)

export default model("User", usersSchema) 