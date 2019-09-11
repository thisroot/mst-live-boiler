import { Method } from "axios"

export interface ReqParams {
    method?: Method
    /** url query params */
    params?: object
    /** request body params */
    body?: object
    headers?: any
}

export interface ApiResParams<T> {
    result: Array<T>
    next?: object
}

export interface onProgressEvent {
    loaded: number,
    total: number
}
