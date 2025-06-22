const { v4: uuid } = require('uuid');
const { format } = require('date-fns');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const logEvents = async (message, fileName) => {
  const dateTime = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}`;
  
  try {
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir);
    }
    await fsPromises.appendFile(
      path.join(logsDir, fileName), 
      `${logItem}\n`
    );
  } catch (error) {
    console.error('Logging error:', error.message);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };