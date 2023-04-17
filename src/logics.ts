import { Request, Response } from "express";
import {
  TDeveloperRequest,
  TDeveloperResult,
  TInfoRequest,
  TInfoResult,
} from "./interfaces";
import format from "pg-format";
import { client } from "./database";
import { QueryConfig } from "pg";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload: TDeveloperRequest = req.body;

  const queryString = format(
    `
    INSERT INTO developers(%I)
    VALUES(%L)
    RETURNING *;
    `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: TDeveloperResult = await client.query(queryString);
  const createdDeveloper = queryResult.rows[0];

  return res.status(201).json(createdDeveloper);
};

const retrieveDeveloperById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT dv.id "developerId",
        dv.name "developerName",
        dv.email "developerEmail",
        di."developerSince" "developerInfoDeveloperSince",
        di."preferredOS" "developerInfoPreferredOS"
    FROM 
        developers AS dv
    LEFT JOIN
        developer_infos di 
    ON 
        dv.id = di."developerId" 
    WHERE 
        dv.id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const upDateDeveloperById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const payload: TDeveloperRequest = req.body;

  const queryString: string = format(
    `
    UPDATE 
        developers
    SET(%I) = ROW(%L)
    WHERE
        Id = $1
    RETURNING *;

  `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TDeveloperResult = await client.query(queryConfig);
  const updateDeveloper = queryResult.rows[0];

  return res.status(200).json(updateDeveloper);
};

const deleteDeveloperById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE 
      FROM 
        developers
      WHERE id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);
  return res.status(204).send();
};

const createDeveloperInfos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload: TInfoRequest = req.body;
  const id = parseInt(req.params.id);
  const preferred: string[] = ["Windows", "Linux", "MacOS"];

  if (!preferred.includes(payload.preferredOS)) {
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  const queryString = format(
    `
    INSERT INTO developer_infos(%I, "developerId")
    VALUES(%L, %L)
    RETURNING *;
    `,
    Object.keys(payload),
    Object.values(payload),
    id
  );

  const queryResult: TInfoResult = await client.query(queryString);
  const createdDeveloperInfos = queryResult.rows[0];

  return res.status(201).json(createdDeveloperInfos);
};

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload = req.body;

  const queryString = format(
    `
    INSERT INTO projects(%I)
    VALUES(%L)
    RETURNING *;
    `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult = await client.query(queryString);
  const createdProject = queryResult.rows[0];

  return res.status(201).json(createdProject);
};

const retrieveProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;

  const queryString: string = `
  SELECT pj.id "projectId", 
        pj."name" "projectName",
        pj.description "projectDescription",
        pj."estimatedTime" "projectEstimatedTime",
        pj.repository "projectRepository",
        pj."startDate" "projectEndDate",
        pj."developerId" "projectDeveloperId",
        tc.id "technologyId",
        tc.name "technologyName"
  FROM 
      projects AS pj
  LEFT JOIN 
      projects_technologies pt
  ON 
      pt."projectId" = pj.id
  LEFT JOIN 
      technologies tc
  ON 
      pt."technologyId" = tc.id
  WHERE 
    pj.id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const upDateProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const payload = req.body;

  const queryString: string = format(
    `
    UPDATE 
        projects
    SET(%I) = ROW(%L)
    WHERE
        Id = $1
    RETURNING *;

  `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);
  const updateProject = queryResult.rows[0];

  return res.status(200).json(updateProject);
};

const deleteProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;

  const queryString: string = `
    DELETE 
      FROM 
        projects
      WHERE id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);
  return res.status(204).send();
};

export {
  createDeveloper,
  retrieveDeveloperById,
  upDateDeveloperById,
  deleteDeveloperById,
  createDeveloperInfos,
  createProject,
  retrieveProjectById,
  upDateProjectById,
  deleteProjectById,
};
