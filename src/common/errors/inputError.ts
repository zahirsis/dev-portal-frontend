type Errors = {
    [key: string]: string[]
}[]

export const INPUT_ERROR = 'InputError';

export class InputError extends Error {
    constructor(message: string, protected errors: Errors) {
        super(message);
        this.name = INPUT_ERROR;
    }

    getErrors() {
        return this.errors;
    }
}