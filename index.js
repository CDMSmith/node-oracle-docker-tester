require('dotenv').config();

const { PORT, NODE_ENV, DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
const port = Number(PORT);

console.log(`PORT=${PORT}\nNODE_ENV=${NODE_ENV}\nDB_HOST=${DB_HOST}`);

if (!isNaN(port) && port > 0) {
  const oracledb = require('oracledb');
  return require('http').createServer(async (_, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
  
    let connection; 
    try {
      connection = await oracledb.getConnection({ user: DB_USER, password: DB_PASS, connectString: `${DB_HOST}/${DB_NAME}` });
      connection.callTimeout = 1500;
  
      await connection.execute('select 1 as success from dual', {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      await connection.release();
  
      console.log('Database is reachable!');  
      res.end('It works!');
    } catch (err) {
      connection && await connection.release().catch(e => console.log(e));  
      console.log('Database is not reachable!', err);
      res.end('There is a problem!');
    }
  }).listen(port, () => console.log(`Server started on port ${PORT}`));
}

console.log('Server not started!\nMost likely, the PORT environment variable is not defined or is not a number.');
