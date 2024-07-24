class HttpError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends HttpError {
    constructor(message: string) {
        super(400, message);
    }
}

class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(401, message);
    }
}

class ForbiddenError extends HttpError {
    constructor(message: string) {
        super(403, message);
    }
}

class NotFoundError extends HttpError {
    constructor(message: string) {
        super(404, message);
    }
}

class ConflictError extends HttpError {
    constructor(message: string) {
        super(409, message);
    }
}

class InternalServerError extends HttpError {
    constructor(message: string) {
        super(500, message);
    }
}

export default HttpError;

export {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError,
};
