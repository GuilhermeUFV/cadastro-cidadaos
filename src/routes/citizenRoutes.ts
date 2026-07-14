import { Router } from "express";
import { CitizenController } from "../controllers/CitizenController.js";

const citizenController = new CitizenController();

export const citizenRoutes = Router();

citizenRoutes.post("/", citizenController.create);
citizenRoutes.get("/", citizenController.search);
