export class APIError extends Error {
    public readonly status: number;
    public readonly isOperational: boolean;
    constructor(status: number, message: string, isOperational: boolean = true) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype)
    }
}
