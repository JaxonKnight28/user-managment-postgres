const express = require('express');
const pg = require('pg');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//postgres---------
//const connectionString = 'postgres://user:password@host:5432/dbname;
//host could be localhost, ip address or hostname
const connectionString = 'postgres://postgres:postgres@localhost:5432/mtechdb';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
    'select * from users', (err, result) => {
        console.log('result');
        console.log(result.rows);
        client.end();
    });
//-----------------



app.get('/', (req, res) => {
    res.send('Hello!')
})

app.listen(port, () => {
    query;
    console.log(`Server is up on ${port}`);
})