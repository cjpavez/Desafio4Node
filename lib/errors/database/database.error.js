export default class DatabaseError extends Error {
	constructor(message = "Error en la base de datos.", options = {}) {
		super(message, { cause: options.cause });
		this.name = "DatabaseError";
		this.code = options.code;
		this.details = options.details;
		this.operation = options.operation;
		this.statusCode = options.statusCode || 500;
	}

	static from(error, operation, message) {
		if (error instanceof DatabaseError) {
			return error;
		}

		return new DatabaseError(message, {
			cause: error,
			code: error?.code,
			details: error?.detail,
			operation,
		});
	}
}