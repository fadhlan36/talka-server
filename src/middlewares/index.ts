import { AppError } from "../errors/AppError";
import { type Request, type Response, type NextFunction } from "express";
import {
  handlePrismaError,
  isPrismaError,
  isPrismaValidationError,
} from "./prismaErrorHandler";

export const log = (...params: unknown[]): void => {
  if (process.env.NODE_ENV === "development") {
    console.error(...params);
  }
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  let statusCode = 500;
  let message = "Terjadi kesalahan di server";
  let code: string | undefined;
  let errors: string[] | undefined;

  // Handle AppError (custom error)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = "APP_ERROR";

    log("Error terjadi:", message);
  } else if (err instanceof SyntaxError && "body" in err) {
    const contentType = req.get("Content-Type") || "unknown";

    return res.status(400).json({
      success: false,
      message: "Invalid request body format",
      error: `Body format does not match Content-Type: ${contentType}`,
    });
  }

  // Handle Prisma Known Errors (P2002, P2025, etc.)
  else if (isPrismaError(err)) {
    const prismaError = handlePrismaError(err);

    if (prismaError) {
      statusCode = prismaError.statusCode;
      message = prismaError.message;
      code = err.code;

      // Details masuk ke array errors
      if (prismaError.details) {
        errors = [prismaError.details];
      }

      log("Prisma Error:", {
        code: err.code,
        message: prismaError.message,
        meta: err.meta,
      });
    }
  }
  // Handle Prisma Validation Errors
  else if (isPrismaValidationError(err)) {
    statusCode = 400;
    message = "Data tidak valid";
    code = "VALIDATION_ERROR";
    errors = ["Format data yang dikirim tidak sesuai"];

    log("Prisma Validation Error:", err.message);
  }
  // Handle standard Error
  else if (err instanceof Error) {
    message = err.message;
    code = "INTERNAL_ERROR";
    log("Standard Error:", err);
  }
  // Handle unknown error
  else {
    log("Unknown Error:", err);
  }

  // Build consistent response
  const response: {
    success: false;
    message: string;
    code?: string;
    errors?: string[];
    stack?: string;
  } = {
    success: false,
    message,
  };

  if (code) response.code = code;
  if (errors && errors.length > 0) response.errors = errors;
  if (process.env.NODE_ENV === "development" && err instanceof Error) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} tidak ditemukan`,
  });
};
