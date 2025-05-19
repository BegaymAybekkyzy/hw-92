export interface IUserApi {
    _id: string;
    username: string;
}

export interface IUserForm {
    username: string;
    password: string;
}

export interface IValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        };
    };
    message: string;
    name: string;
    _message: string;
}

export interface IErrorMessage {
    error: string;
}
