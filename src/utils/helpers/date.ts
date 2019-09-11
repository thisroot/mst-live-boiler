import { constants } from 'constants/constants'

function isIsoDateString(arg): arg is string {
    return typeof arg === "string" && constants.REGEXP.date.test(arg);
}

export {
    isIsoDateString
}
