import {JwtPayload} from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
    id?: string;
    iat?: number;
    exp?: number;
}
