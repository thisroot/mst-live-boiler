import { REGEXP } from 'constants/common'

function isIsoDateString(arg): arg is string {
    return typeof arg === "string" && REGEXP.date.test(arg);
}

export {
    isIsoDateString
}
