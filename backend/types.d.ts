export interface IUser {
    username: string;
    password: string;
    status: boolean;
    token: string;
}

export interface IIncomingMessage {
    type: string;
    payload: string;
}