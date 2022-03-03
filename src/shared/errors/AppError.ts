class AppError extends Error {
  public readonly name: string;

  public readonly statusCode: number;
  // public readonly message: string;

  constructor(message: string, statusCode = 400) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    // this.message = message;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export { AppError };
