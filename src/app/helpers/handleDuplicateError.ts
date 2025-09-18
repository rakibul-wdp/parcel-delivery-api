import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  return {
    statusCode: 400,
    message: `${extractedMessage} is already exists`,
  };
};
