import axios from 'axios'
import { localDB } from 'utils/localDB'
import { ReqParams, onProgressEvent } from './ApiService.d'
import { has, get } from 'lodash'
import { appConfig  } from 'constants/appConfig'
import { ApiError } from './ApiError'

type onProgressRequest = (event: onProgressEvent) => any

const getCurrentToken = () => {
    return localDB.getItem(appConfig.LOCALSTORAGE_KEY_NAMES.JWT_TOKEN)
}

const base_URL = appConfig.LOCAL_DEV_PATHS.REST_API

export class ApiService {
    /**
     * @helper
     * Validate response code
     * @param response
     */
    resolveResponse(response) {
        if (response.status >= 400) {
            throw new ApiError({ code: response.status, message: response.body.error || response.statusText })
        } else {
            return has(response.body, 'result') ? Object.assign({ next: null }, response.body) : response.body
        }
    }

    /**
     * API Request function
     *
     * @param url {String}
     * @param {ReqParams} params
     * @param onProgress
     * @returns {Promise<any>}
     */
    request(url, params: ReqParams = {}, onProgress?: onProgressRequest): Promise<any> {
        const token = getCurrentToken()
        const headers = params.headers || {}
        if (token) headers.Authorization = `Bearer ${token}`
        return axios.request({
            url: base_URL + url,
            method: params.method || 'GET',
            params: { ...params.params },
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            onUploadProgress: onProgress,
            onDownloadProgress: onProgress
        }).then(this.resolveResponse)
            .catch((error) => {
                const message = get(error, 'response.body.error', error.message)
                return Promise.reject(new ApiError({ code: error.status || 500, message }))
            })
    }
}

