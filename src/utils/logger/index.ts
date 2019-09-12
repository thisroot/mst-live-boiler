/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

type LoggerMethods = 'debug'|'log'|'warn'|'error'|'groupCollapsed'|'groupEnd'|'message'|'event'|'info';

interface ConsoleWide extends Console {
    message: (message?: any, ...optionalParams: any[]) => void
    event: (message?: any, ...optionalParams: any[]) => void
}

class ConsoleWide implements ConsoleWide {
    public message = (message?: any, ...optionalParams: any[]) => this.log(message, ...optionalParams)
    public event = (message?: any, ...optionalParams: any[]) => this.log(message, ...optionalParams)
}

const logger = (process.env.NODE_ENV === 'production' ? null : (() => {
    let inGroup = false

    const logMethods = [ 'message', 'event' ]

    const methodToColorMap: { [methodName: string]: string|null } = {
        debug: `#7f8c8d`, // Gray
        log: `#2ecc71`, // Green
        message: '#CE0071',
        event: '#A13DD5',
        info: '#BDBF30',
        warn: `#f39c12`, // Yellow
        error: `#c0392b`, // Red
        groupCollapsed: `#3498db`, // Blue
        groupEnd: null // No colored prefix on groupEnd
    }

    const print = function (method: LoggerMethods, args: any[]) {

        if (method === 'groupCollapsed') {
            // Safari doesn't print all console.groupCollapsed() arguments:
            // https://bugs.webkit.org/show_bug.cgi?id=182754
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                console[method](...args)
                return
            }
        }

        const styles = [
            `background: ${ methodToColorMap[method] }`,
            `border-radius: 0.5em`,
            `color: white`,
            `font-weight: bold`,
            `padding: 2px 0.5em`
        ]

        let prefix = 'agora', argum
        if(args.length > 1) {
            [ prefix, ...argum ] = args
        } else {
            [ ...argum ] = args
        }

        const logPrefix = inGroup ? [] : [ '%c' + prefix, styles.join(';') ]

        if(logMethods.includes(method)) {
            method = 'log'
        }

        // @ts-ignore
        console[method](...logPrefix, ...argum)

        if (method === 'groupCollapsed') {
            inGroup = true
        }
        if (method === 'groupEnd') {
            inGroup = false
        }
    }

    const api: { [methodName: string]: Function } = {}
    const loggerMethods = Object.keys(methodToColorMap)

    for (const key of loggerMethods) {
        const method = key as LoggerMethods

        api[method] = (...args: any[]) => {
            print(method, args)
        }
    }

    return api as unknown
})()) as ConsoleWide

export { logger }
