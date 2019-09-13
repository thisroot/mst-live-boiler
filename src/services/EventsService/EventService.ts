import { SingletonClass } from "models/base"

enum ActionTypes {
    fire = 'fire',
    unsubscribe = 'unsubscribe'
}

enum EventTypes {
    workerChangeState = 'workerChangeState',
    dispatchToRedux = 'dispatchToRedux',
    login = 'login',
    logout = 'logout',
    cacheChanged = 'cacheChanged'
}

export class EventService extends SingletonClass {

    private subscribers: any = {}

    public subscribe = (type: EventTypes, fn: Function, context: any) => {
        fn = typeof fn === 'function' ? fn : context[fn]
        if (typeof this.subscribers[type] === 'undefined') {
            this.subscribers[type] = []
        }
        this.subscribers[type].push({ fn, context: context || this })
    }

    public unsubscribe = (type: EventTypes, fn: Function, context: any) => {
        this.visitSubscribers(ActionTypes.unsubscribe, type, fn, context || this)
    }

    public fire = (type: EventTypes, publication?: any) => {
        this.visitSubscribers(ActionTypes.fire, type, publication, null)
    }

    private visitSubscribers = (action: ActionTypes, type: EventTypes, arg: any, context: any) => {
        const subscribers = this.subscribers[type]
        const max = subscribers ? subscribers.length : 0
        for (let i = 0; i < max; i += 1) {
            switch (action) {
                case ActionTypes.fire:
                    subscribers[i].fn.call(subscribers[i].context, arg)
                    break
                case ActionTypes.unsubscribe:
                default:
                    if (subscribers[i].fn === arg &&
                        subscribers[i].context === context) {
                        subscribers[i] = null
                    }
                    break
            }
        }
        this.subscribers[type] = subscribers ? subscribers.filter((item: any) => item !== null) : []
    }
}
export { EventTypes, ActionTypes }
