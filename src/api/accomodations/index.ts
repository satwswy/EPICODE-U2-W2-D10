import express from "express"
import createHttpError from "http-errors"
import { JWTAuthMiddleware } from "../lib/auth/token"
import AccomodationsModel from "./model.js"

const accomodationsRouter = express.Router()

accomodationsRouter.post("/",JWTAuthMiddleware,  async (req, res, next) => {
    try {
      const newAccomodation = new AccomodationsModel(req.body) 
      const { _id } = await newAccomodation.save()
  
      res.status(201).send({ _id })
    } catch (error) {
      next(error)
    }
  })

accomodationsRouter.get("/",JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodations = await AccomodationsModel.find().populate({ path: "users" });
    res.send(accomodations);
  } catch (error) {
    next(error);
  }
});

accomodationsRouter.get("/:accomodationId",JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodation = await AccomodationsModel.findById(req.params.accomodationId).populate({ path: "users" });
    if (accomodation) {
      res.send(accomodation);
    } else {
      next(
        createHttpError(404, `Accomodation with id ${req.params.accomodationId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

accomodationsRouter.put("/:accomodationId", async (req, res, next) => {
  try {
    const updatedAccomodation = await AccomodationsModel.findByIdAndUpdate(
      req.params.accomodationId,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedAccomodation) {
      res.send(updatedAccomodation);
    } else {
      next(
        createHttpError(404, `Accomodation with id ${req.params.accomodationId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

accomodationsRouter.delete("/:accomodationId", async (req, res, next) => {
  try {
    const deletedAccomodation = await AccomodationsModel.findByIdAndDelete(req.params.accomodationId);
    if (deletedAccomodation) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Accomodation with id ${req.params.accomodationId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default accomodationsRouter