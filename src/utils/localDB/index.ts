/*
  wrapper for safe using localDB methods
  for example fixed safari 10 in private mode
*/
interface HandlerObj {
    setItem: (arg1: string, arg2: string) => boolean
    getItem: (arg1: string) => string
    removeItem: (arg1: string) => boolean
    clear: () => boolean
}

const localDB: HandlerObj = {
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value)
            return true
        } catch (error) {
            return false
        }
    },
    getItem: (key) => {
        try {
            return localStorage.getItem(key)
        } catch (error) {
            return null
        }
    },
    removeItem: (key) => {
        try {
            localStorage.removeItem(key)
            return true
        } catch (error) {
            return false
        }
    },
    clear: () => {
        try {
            localStorage.clear()
            return true
        } catch (error) {
            return false
        }
    }
}

export { localDB }
