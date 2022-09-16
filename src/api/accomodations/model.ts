import mongoose from "mongoose"

const { Schema, model } = mongoose

const accomodationsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxGuests: {type: Number, required: true},
    city: {type: String, required: true},
    host: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true, 
  }
);



  

export default model("Accomodation", accomodationsSchema) 