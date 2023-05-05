const database = require('./database'),
    { body, validationResult } = require('express-validator');

// Check whether the id is a number
const isNumber = (number) =>
{
    return !Number.isNaN(number);
};

// Get users
const getUsers = (req, res) =>
{
    const id = Number.parseInt(req.params.id, 10),
        query = isNumber(id) ? "SELECT * FROM users WHERE id = ?" : "SELECT * FROM users",
        preparedStatements = isNumber(id) ? [id] : [];
    database
        .query(query, preparedStatements)
        .then(([users]) =>
        {
            if (isNumber(id)) users[0] ? res.json(users[0]) : res.status(404).send('Not found');
            else res.json(users);
        })
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error retrieving data from database');
        });
};

// Validate user
const validateUser =
[
    body('firstName').trim().notEmpty().isLength({ max: 255 }),
    body('lastName').trim().notEmpty().isLength({ max: 255 }),
    body('email').isEmail(),
    body('city').trim().notEmpty().isLength({ max: 255 }),
    body('language').trim().notEmpty().isLength({ max: 255 }),
    (req, res, next) =>
    {
        const errors = validationResult(req);
        if (errors.isEmpty()) next();
        else res.status(422).json({ validationErrors: errors.array() });
    }
];

// Set user
const setUser = (req, res) =>
{
    const { firstName, lastName, email, city, language } = req.body;
    database
        .query("INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)", [firstName, lastName, email, city, language])
        .then(([result]) => res.location(`/api/users/${result.insertId}`).sendStatus(201))
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error saving the user');
        });
};

// Update user
const updateUser = (req, res) =>
{
    const id = Number.parseInt(req.params.id, 10),
        { firstName, lastName, email, city, language } = req.body;
    database
        .query("UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?", [firstName, lastName, email, city, language, id])
        .then(([result]) =>
        {
            if (result.affectedRows) res.sendStatus(204);
            else res.status(404).send('User not found');
        })
        .catch(err =>
        {
            console.error(err);
            res.status(500).send('Error saving the user');
        });
};

module.exports =
{
    getUsers,
    validateUser,
    setUser,
    updateUser
};