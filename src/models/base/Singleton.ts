class SingletonClass {
    private static instance: any
    public name: string = ""
    
    constructor(name: string = "") {
        if (!!SingletonClass.instance) {
            return SingletonClass.instance;
        }

        SingletonClass.instance = this;
        this.name = name;
        return this;
    }

    getName() {
        return this.name;
    }
}

export {
    SingletonClass
}