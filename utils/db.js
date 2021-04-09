const low = require('lowdb')
const path = require('path')
const FileSync = require('lowdb/adapters/FileSync')

const resetAuth = () => {
    let db = low(new FileSync(path.join(__dirname, `../db/auth.json`)))
    db.set('email', '').set('authorization', '').set('refreshToken', '').write()
}

const resetData = (name) => {
    let db = low(new FileSync(path.join(__dirname, `../db/${name}.json`)))
    db.defaults({ data: []}).write()
}


const get = (db, obj) => new Promise((resolve, reject) => {
    let dba = low(new FileSync(path.join(__dirname, `../db/${db}.json`)))
    const isEmpty = dba.get(obj).isEmpty().value()
    if (!isEmpty) {
        const records = dba
            .get(obj)
            .value()
        return resolve(records)
    } else {
        return resolve(null)
    }
})

const add = (db, data) => new Promise((resolve, reject) => {
    let dba = low(new FileSync(path.join(__dirname, `../db/${db}.json`)))
    let insertRecords
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const findRecords = dba.get('data').some({id: item.id}).value()
        if (!findRecords) {
            insertRecords = dba.get('data').push(item).write()
            if (!insertRecords) return reject('[DB] Error!', insertRecords)
        } else {
            insertRecords = dba.get('data').find({ id: item.id }).assign(item).write()
            if (!insertRecords) return reject('[DB] Error!', insertRecords)
        }
    }
    resolve(insertRecords)
});

const auth = (data) => new Promise((resolve, reject) => {
    let dba = low(new FileSync(path.join(__dirname, `../db/auth.json`)))
    let record
    record = dba
        .set('email', data.email)
        .set('authorization', data.authorization)
        .set('refreshToken', data.refreshToken)
        .write()
    if (!record) return reject('[DB] Error!', record)
    resolve(record)
});


module.exports = {
    get,
    add,
    auth,
    resetAuth,
    resetData
}