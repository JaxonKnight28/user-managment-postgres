const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require('./db');

app.get('/getNames', db.getNames);
app.post('/create', db.createUser)
app.post('/delete', db.deleteUser)
app.post('/getContactByName', db.getContactByName)
app.get('/getContacts', db.getContacts);
app.post('/updateContactById', db.updateContactById);
app.post('/getContactById', db.getContactById);

app.get('/', (req, res) => {
    res.send(`
    <h1>User Manager with Postgres on Heroku</h1>
    <h3>Add user:</h3>
    <form action="/create" method="post">
        <input name="firstName" placeholder="First Name" />
        <input name="lastName" placeholder="Last Name" />
        <input name="email" placeholder="Email" />
        <input name="phone" placeholder="phone" />
        <input name="age" placeholder="Age" />
        <input name="language" placeholder="Language" />
        <input type="submit">
    </form>

    <h3>Remove User by ID:</h3>
    <form action="/delete" method="post">
        <input name="id" placeholder="ID" />
        <input type="submit">
    </form>

    <h3>Get Contact by ID:</h3>
    <form action="/getContactById" method="post">
        <input name="id" placeholder="ID" />
        <input type="submit">
    </form>

    <h3>Get Contact by first or last name:</h3>
    <form action="/getContactByName" method="post">
        <input name="name" placeholder="Name" />
        <input type="submit">
    </form>

    <h3>Edit user:</h3>
    <form action="/updateContactById" method="post">
        <input name="id" placeholder="ID" />
        <input name="firstName" placeholder="First Name" />
        <input name="lastName" placeholder="Last Name" />
        <input name="email" placeholder="Email" />
        <input name="phone" placeholder="phone" />
        <input name="age" placeholder="Age" />
        <input name="language" placeholder="Language" />
        <input type="submit">
    </form>

    <h3>Get names</h3>
    <a href="/getNames">Get Names</a>
    <br>
    <a href="/getContacts">Get 10 Contacts</a>
    `);
})

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
})
