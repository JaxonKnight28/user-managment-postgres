//api to the database
const Pool = require('pg').Pool;
const { v4: uuidv4 } = require('uuid');
const herokudb = process.env.HEROKU_DB || false;

let dbURL = {
    connectionString: process.env.DATABASE_URL
}

//additional flags needed for local app to access remote db on heroku
//https://security.stackexchange.com/questions/229282/is-it-safe-to-set-rejectunauthorized-to-false-when-using-herokus-postgres-datab
if (herokudb) {
    dbURL.ssl = {
        sslmode: 'require',
        rejectUnauthorized: false
    };
}

const pool = new Pool(dbURL);

pool.connect();
const getContacts = (req, res) => {
    pool.query('SELECT * from contact limit 10 ', (err, results) => {
        if (err) throw err;
        let finalHTML = ' <a href="/">Back</a>'
        results.rows.forEach((item) => {
            finalHTML += `
            <h3>Name: ${item.first_name} ${item.last_name}</h3>
            <p>Age: ${item.age}</p>
            <p>Email: ${item.email}</p>
            <p>Phone: ${item.phone}</p>
            <p>Language: ${item.language}</p>
            <p>Created: ${item.created}</p>
            <p>ID: ${item.id}</p>
            <p>-------------------</p>
            `
        })
        finalHTML += '<a href="/">Back</a>'
        //res.status(200).json(finalHTML);
        res.send(finalHTML)
        // for (let row of results.rows) {
        //     console.log(JSON.stringify(row));
        // }
        // res.status(200).json(results.rows);
    })
};
const getNames = (req, res) => {
    pool.query('SELECT first_name, last_name FROM contact ORDER BY first_name ASC', (error, results) => {
        if (error) {
            throw error;
        }
        let finalHTML = '<h1>List of Users:</h2>  <a href="/">Back</a>'
        results.rows.forEach((item) => {
            finalHTML += `<h3>Name: ${item.first_name} ${item.last_name}</h3>`
        })
        finalHTML += ' <a href="/">Back</a>'
        res.send(finalHTML)
    })
};
const updateContactById = (req, res) => {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email
    let phone = req.body.phone
    let age = req.body.age
    let language = req.body.language
    let id = req.body.id

    pool.query(`update contact set first_name = '${firstName}', last_name = '${lastName}', email = '${email}', phone = '${phone}', age = '${age}', language = '${language}' where id = '${id}' returning *;`, (error, results) => {
        if (results.rows[0]) {
            res.send(results);
        } else {
            res.send('<h1>Error: ID does not match a user</h1> <a href="/">Back</a>')
        }
    })
}
const getContactById = (req, res) => {
    let id = req.body.id;
    let finalHTML = ''
    pool.query(`SELECT * from contact where id = '${id}'`, (err, results) => {
        if (results.rows[0]) {
            finalHTML += `
            <h3>Name: ${results.rows[0].first_name} ${results.rows[0].last_name}</h3>
            <p>Age: ${results.rows[0].age}</p>
            <p>Email: ${results.rows[0].email}</p>
            <p>Phone: ${results.rows[0].phone}</p>
            <p>Language: ${results.rows[0].language}</p>
            <p>Created: ${results.rows[0].created}</p>
            <p>ID: ${results.rows[0].id}</p>
            <a href="/">Back</a>
            `
            res.send(finalHTML)
        } else {
            res.send('<h1>Error: ID does not match a user</h1> <a href="/">Back</a>')
        }
    })
}
const getContactByName = (req, res) => {
    let name = req.body.name;
    let finalHTML = ''
    pool.query(`SELECT * from contact where first_name = '${name}' or last_name = '${name}'`, (err, results) => {
        if (results.rows[0]) {
            finalHTML += `
            <h3>Name: ${results.rows[0].first_name} ${results.rows[0].last_name}</h3>
            <p>Age: ${results.rows[0].age}</p>
            <p>Email: ${results.rows[0].email}</p>
            <p>Phone: ${results.rows[0].phone}</p>
            <p>Language: ${results.rows[0].language}</p>
            <p>Created: ${results.rows[0].created}</p>
            <p>ID: ${results.rows[0].id}</p>
            <a href="/">Back</a>
            `
            res.send(finalHTML)
        } else {
            res.send('<h1>Error: Name does not match a user</h1> <a href="/">Back</a>')
        }
    })
}

const createUser = (req, res) => {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email
    let phone = req.body.phone
    let age = req.body.age
    let language = req.body.language
    let id = uuidv4()

    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    date = year + "/" + month + "/" + day;
    pool.query(`insert into contact (id, first_name, last_name, age, email, phone, language, created) values ('${id}', '${firstName}', '${lastName}', ${age}, '${email}', '${phone}', '${language}', '${date}');`);
    res.send(
        `
        <h3>Name: ${firstName} ${lastName}</h3>
        <p>Age: ${age}</p>
        <p>Email: ${email}</p>
        <p>Email: ${phone}</p>
        <p>Language: ${language}</p>
        <p>Created: ${date}</p>
        <p>ID: ${id}</p>
        <a href="/">Back</a>
        `
    );
}

const deleteUser = (req, res) => {
    let id = req.body.id
    pool.query(`delete from contact where id = '${id}';`, (err, results) => {
        if (results.rowCount) {
            console.log(results)
            res.send(`Deleted user with id of ${id} <a href="/">Back</a>`)
        } else {
            res.send('<h1>Error: ID does not match a user</h1> <a href="/">Back</a>')
        }
    })
}

module.exports = { getContacts, getNames, updateContactById, getContactById, createUser, deleteUser, getContactByName };