import localforage from 'localforage'
// import { ObservableTypes, observer as helperObserver } from '../helpers'
// import { get } from 'lodash'

export enum DATA_BASES {
   POSTS= 'POSTS'
}

const conf = {
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE]
}

// подумать может можно будет заменить на сервис
// helperObserver.subscribe(ObservableTypes.login, resetDB, this)
// helperObserver.subscribe(ObservableTypes.logout, resetDB, this)

// async function resetDB() {
//     Object.values(DATA_BASES).forEach(async (name) => {
//         const db = await localforage.createInstance({ name })
//         db.clear()
//     })
// }

async function initDB(name: string = 'pss', version: number = 2): Promise<LocalForage> {
    // пример миграци
    // создаем инстанс с новой версией
    // если инстанс не возвращает указатель на существующую базу и
    // мы делаем запрос к прошлым версиям и получаем значения
    // то можно провести перенос данных из одной версии в другую
    // const db2 = localforage.createInstance({ ...conf, name, version: 5 })
    // console.log(get(db2, '_dbInfo'))
    // if (!get(db2, '_dbInfo')) {
    //   console.log('переносим данные')
    //   const item = db.getItem('dds')
    //   db2.setItem('dds', 236546542343)
    //   db.removeItem('dds')
    // }
    return localforage.createInstance({ ...conf, name, version })
}

export default initDB
