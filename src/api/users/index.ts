import express from "express";
import createError from "http-errors";
import { JWTAuthMiddleware } from "../lib/auth/token";
import { createAccessToken } from "../lib/auth/tools";
import UsersModel from "./model";


const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    
    const { _id } = await newUser.save();
    const token = await createAccessToken({ _id: newUser._id, role: newUser.role })

    res.status(201).send({_id,token});
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});


usersRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(
        createError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put(
  "/:userId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true, runValidators: true }
      );

      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(
          createError(404, `User with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete(
  "/:userId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
      if (deletedUser) {
        res.status(204).send();
      } else {
        next(
          createError(404, `User with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post("/login", async (req, res, next) => {
    try {
      
      const { email, password } = req.body
  
      
      const user = await UsersModel.checkCredentials(email, password)
  
      if (user) {
        
        const token = await createAccessToken({ _id: user._id, role: user.role })
        res.send({ accessToken: token })
      } else {
       
        next(createError(401, "Credentials are not ok!"))
      }
    } catch (error) {
      next(error)
    }
  })


export default usersRouter