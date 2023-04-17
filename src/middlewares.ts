import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { TDeveloperResult } from "./interfaces";
import { client } from "./database";

const verifyEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const payload: string = req.body.email;

  const queryString: string = `
    SELECT email FROM developers WHERE email = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [payload],
  };

  const queryResult = await client.query(queryConfig);

  if (queryResult.rows[0]) {
    return res.status(409).json({ message: "Email already exists." });
  }

  return next();
};

const ensureDeveloperExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number = parseInt(req.params.id);

  if (req.route.path === "/projects/:id") {
    id = parseInt(req.body.developerId);
  }

  const queryString: string = `
  SELECT
       * 
  FROM 
      developers
  WHERE Id = $1
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);
  const developerById = queryResult.rows[0];

  if (!developerById) {
    return res.status(404).json({ message: "Developer not found." });
  }

  return next();
};

const verifyInfosExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.params.id;

  const queryString: string = `
    SELECT * FROM developer_infos WHERE "developerId" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);

  if (queryResult.rows[0]) {
    return res.status(409).json({ message: "Developer infos already exists." });
  }

  return next();
};
const verifyProjectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.params.id;

  const queryString: string = `
    SELECT * FROM projects WHERE id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);

  if (!queryResult.rows[0]) {
    return res.status(404).json({ message: "Project not found." });
  }

  return next();
};

const verifyTechhnologyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const technology = req.body.name;

  const queryString: string = `
    SELECT * FROM technologies WHERE "name" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [technology],
  };

  const queryResult = await client.query(queryConfig);

  if (!queryResult.rows[0]) {
    return res.status(400).json({
      message: "Invalid technology option.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.technology = queryResult.rows[0];

  return next();
};

const verifyTechhnologyExistsInProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const technology = req.body.name;

  const queryString: string = `
  SELECT *
  FROM 
      technologies
  LEFT JOIN 
      projects_technologies
  ON 
      technologies.id = projects_technologies."technologyId"
  LEFT JOIN 
      projects
  ON 
      projects.id = $1
  WHERE 
  technologies.id = $2
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [technology],
  };

  const queryResult = await client.query(queryConfig);

  if (queryResult.rows[0]) {
    return res.status(400).json({
      message: "Invalid technology option.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  return next();
};

export {
  verifyEmailExists,
  ensureDeveloperExist,
  verifyInfosExists,
  verifyProjectExists,
  verifyTechhnologyExists,
  verifyTechhnologyExistsInProject,
};
