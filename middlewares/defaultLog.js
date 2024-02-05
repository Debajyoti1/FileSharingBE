const logger = require('../configs/logger')
module.exports.defaultLog = (req, res, next) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    });
    let ip=req.headers['x-real-ip'] || req.connection.remoteAddress
    logger.info(`${formattedDate} - ${ip} '${req.path}' ${req.method}`)
    next()
}