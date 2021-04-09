const config = require('./config.json');
const api = require('./utils/request');
const delay = require('delay');
const storage = require('./utils/db');
const banner = require('./utils/banner');
const Ora = require('ora');
const { grey} = require('chalk');
const spinner = new Ora();
const moment = require('moment-timezone');

(async () => {
    try {
    const title = Buffer.from('UGFja2FnZVBPUlRBTA==', 'base64').toString('utf8')
    banner(title)
    spinner.warn(`Author: Yoga Sakti`);
    // spinner.warn(`Donate (BSC): 0xa3D10e4139A3Af6239707fca29c1B1eCB44dA683`);
    spinner.start('Get stored auth data...');
    const authorizationOld = await storage.get('auth', 'authorization')
    const refreshTokenOld = await storage.get('auth', 'refreshToken')
    const emailOld = await storage.get('auth', 'email')
    let authorization = authorizationOld, refreshToken, email = emailOld;
    if (authorizationOld && emailOld && refreshTokenOld && (emailOld == config.email )) {
        await delay(1000)
        spinner.text = 'Checking account...'
        const checkAacc = await api.getAccInfo(authorizationOld)
        await delay(1000)
        if (checkAacc.error?.hasOwnProperty('code') && checkAacc.error?.hasOwnProperty('message') ) {
            if (refreshTokenOld) {
                spinner.text = 'Refresh Token ...'
                await delay(1000)
                const refresh = await api.refreshToken(refreshTokenOld);
                if (refresh.hasOwnProperty('error') && refresh.error.hasOwnProperty('message')) return spinner.fail('Error: ' + refresh.error.message)
                authorization = refresh.id_token
                refreshToken = refresh.refresh_token
                email = emailOld
                await delay(1000)
                await storage.auth({
                    authorization: authorization,
                    refreshToken: refreshToken,
                    email: email
                })
                spinner.succeed(`Refresh Token Success (${grey(email)})`);
            } else {
                spinner.text = 'Login PackagePORTAL...'
                await delay(1000)
                const login = await api.login(config.email, config.password);
                if (login.hasOwnProperty('code') && checkAacc.hasOwnProperty('message')) return spinner.fail('Error: ' + checkAacc.message)
                authorization = login.idToken
                refreshToken = login.refreshToken
                email = login.email
                await delay(1000)
                await storage.auth({
                    authorization: authorization,
                    refreshToken: refreshToken,
                    email: email
                })
                spinner.succeed(`Login Success (${grey(email)})`);
            }
            
        }
    } else {
        if (!config.email || !config.password) return spinner.fail(`Login Failed: Periksa file config.json`);
        storage.resetAuth()
        spinner.text = 'Login PackagePORTAL...'
        await delay(1000)
        const login = await api.login(config.email, config.password);
        console.log(login)
        if (login.error && login.error.hasOwnProperty('message')) return spinner.fail('Error: ' + login.error.message)
        authorization = login.idToken
        refreshToken = login.refreshToken
        email = login.email
        await delay(1000)
        await storage.auth({
            authorization: authorization,
            refreshToken: refreshToken,
            email: email
        })
        spinner.succeed(`Login Success (${grey(email)})`);
    }
    spinner.start('Get user data...');
    await delay(1000)
    const getProfile = await api.getUser(authorization)
    if (!getProfile) return spinner.fail('Error: Get User Error')
    let { id, first_name, last_name, wallet_address } = getProfile
    await delay(1000)
    spinner.info(`Hi ${first_name} ${last_name}, how are u?`);
    spinner.start(`Get trx from wallet ${wallet_address}...`);
    const trx = await api.getTrx(wallet_address)
    spinner.info(`checking trx in ${wallet_address}...`)
    await delay(1000)
    if (trx.total == 0) {
        storage.resetData('trx')
        storage.resetData('trackNum')
        return spinner.fail('gada yang landing bos, balek tidur aja')
    }
    spinner.succeed(`found ${trx.total} trx data`);
    spinner.start(`processing trx data...`);
    let trxs = []
    trx.docs.map(item => {
        if (item.extra.methodParams[0].value.includes('zil')) return
        trxs.push({
            uid: item.extra.methodParams[0].value,
            id: item.extra.methodParams[1].value,
            timestamp: item.timestamp
        })
    })
    await storage.add('trx', trxs)
    spinner.info(`fetch all scans on ${title}`)
    spinner.start(`checking ${trx.total} trx...`);
    await delay(1000)
    spinner.text = 'fetching tracking number...'
    const trackNum = await api.getTN(authorization)
    trackNum.map((item) => {
        item.result = (item.tracking_numbers?.length >= 1) ? item.tracking_numbers[0].result : 'waiting'
        delete item.batch_uuid
        delete item.tracking_numbers
    })
    await delay(1000)
    await storage.add('trackNum', trackNum)
    spinner.succeed(`got all required data, processing...`)
    spinner.start(`proccessing...`);
    await delay(1000)
    trxs.map((tx) => {
        const search = trackNum.find((tn) => tn.id == tx.id)
        if (search) {
            let scanDate = moment(search.created_at).tz("Asia/Jakarta")
            let landDate = moment(tx.timestamp).tz("Asia/Jakarta")
            spinner.info(`[${scanDate.format('LLL')}] ID: ${search.id} => TN Result: ${search.result} | TN Code: ${search.tracking_number} | PORT Land: ${landDate.format('LLL')}`);
        }
    })
    spinner.succeed(`Done`);
    } catch (error) {
        console.error(error)
    }
})();