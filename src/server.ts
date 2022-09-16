import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./api/users";
import accomodationsRouter from "./api/accomodations";
import {
  forbiddenErrorHandler,
  genericErroHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/users", usersRouter);
server.use("/accomodations", accomodationsRouter);

server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErroHandler);


if(process.env.MONGO_CONNECTION_URL) mongoose.connect(process.env.MONGO_CONNECTION_URL);
else throw new Error("Mongo url missing!")


mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
