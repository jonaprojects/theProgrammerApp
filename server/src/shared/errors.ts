export class ApiError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, "NOT_FOUND", `${resource} was not found`);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Authentication is required") {
    super(401, "UNAUTHORIZED", message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You are not allowed to perform this action") {
    super(403, "FORBIDDEN", message);
  }
}

export class ConflictError extends ApiError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}
