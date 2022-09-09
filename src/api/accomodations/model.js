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


UserSchema.pre("save", async function (next) {
    const currentUser = this;
  
    const plainPW = currentUser.password;
  
    if (currentUser.isModified("password")) {
      const hash = await bcrypt.hash(plainPW, 11);
      currentUser.password = hash;
    }
  
    next();
  });

  UserSchema.methods.toJSON = function () {
    const userDocument = this;
    const user = userDocument.toObject();
  
    delete user.password;
    delete user.__v;
    return user;
  };

  UserSchema.static("checkCredentials", async function (email, plainPassword) {
    const user = await this.findOne({ email });
  
    if (user) {
      console.log("USER: ", user);
  
      const isMatch = await bcrypt.compare(plainPassword, user.password);
  
      if (isMatch) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
  

export default model("Accomodation", accomodationsSchema) 