const winston = require('winston');
const appRoot = require('app-root-path')
require('winston-daily-rotate-file');
const colorizer = winston.format.colorize();

const transportInfo = new (winston.transports.DailyRotateFile)({
  filename: `${appRoot}/logs/${new Date().getMonth()}/info/application-%DATE%-info.log`,
  datePattern: 'YYYY-MM-DD',
});

const transportError = new (winston.transports.DailyRotateFile)({
  filename: `${appRoot}/logs/${new Date().getMonth()}/error/application-%DATE%-error.log`,
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  
});

const loggerError = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.simple(),
    winston.format.printf(msg => 
      colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)
    )
  ),
  transports: [
    new winston.transports.Console(),
    transportError
  ]
});

const loggerInfo = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.simple(),
    winston.format.printf(msg => 
      colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)
    )
  ),
  transports: [
    new winston.transports.Console(),
    transportInfo
  ]
});

module.exports = { loggerError, loggerInfo } 
