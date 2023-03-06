import { Request } from 'express';

// This interface is used to type the request body
export interface TypedRequestBody<T> extends Request {
    body: Partial<T>; // Use Partial to set all properties optional because we cannot be sure the client will send all required properties
}