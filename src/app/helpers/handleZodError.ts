import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";

export const handleZodError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = err.issues.map((issue: any) => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};
