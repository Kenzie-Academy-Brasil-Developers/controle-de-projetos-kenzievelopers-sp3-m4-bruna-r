import express, { Application } from "express";
import "dotenv/config";
import {
  createDeveloper,
  createDeveloperInfos,
  createProject,
  deleteDeveloperById,
  deleteProjectById,
  retrieveDeveloperById,
  retrieveProjectById,
  upDateDeveloperById,
  upDateProjectById,
} from "./logics";
import {
  ensureDeveloperExist,
  verifyEmailExists,
  verifyInfosExists,
  verifyProjectExists,
  verifyTechhnologyExists,
} from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", verifyEmailExists, createDeveloper);
app.get("/developers/:id", ensureDeveloperExist, retrieveDeveloperById);
app.patch(
  "/developers/:id",
  ensureDeveloperExist,
  verifyEmailExists,
  upDateDeveloperById
);
app.delete("/developers/:id", ensureDeveloperExist, deleteDeveloperById);
app.post(
  "/developers/:id/infos",
  ensureDeveloperExist,
  verifyInfosExists,
  createDeveloperInfos
);
app.post("/projects", ensureDeveloperExist, createProject);
app.get("/projects/:id", verifyProjectExists, retrieveProjectById);
app.patch(
  "/projects/:id",
  verifyProjectExists,
  ensureDeveloperExist,
  upDateProjectById
);
app.delete("/projects/:id", verifyProjectExists, deleteProjectById);
app.post(
  "/projects/:id/technologies",
  verifyProjectExists,
  verifyTechhnologyExists
);

export default app;
