import { QueryResult } from "pg";

interface IDeveloper {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
}

type TDeveloperRequest = {
  name: string;
  email: string;
};

type TDeveloperResult = QueryResult<IDeveloper>;

interface IInfo {
  id: number;
  developerSince: Date | null;
  preferredOS: string | null;
  developerId: number;
}

type TInfoRequest = {
  developerSince: Date;
  preferredOS: string;
};
type TInfoResult = QueryResult<IInfo>;

interface IProject {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date;
  developerId: number;
}

type TProjectRequest = {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
};

type TProjectResult = QueryResult<IProject>;
export {
  IDeveloper,
  TDeveloperRequest,
  TDeveloperResult,
  IInfo,
  TInfoRequest,
  TInfoResult,
  IProject,
  TProjectRequest,
  TProjectResult,
};
