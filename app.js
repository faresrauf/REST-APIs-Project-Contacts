require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();
const api = process.env.API_BASE_URL;
const { Contacts } = require('./Models/ContactsModel');

app.use(express.json());
app.use(morgan('dev'));

app.get('/contacts', async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.page || 1);
        console.log(pageNumber);
        const pageItems = parseInt(req.query.items);
        console.log(pageItems);

        const offset = (pageNumber-1) * pageItems;
        const limit = pageItems;

        const { rows: contacts, count } = await Contacts.findAndCountAll({
            limit,
            limit,
        });

        if (contacts.length === 0) {
            res.status(404).json({
                message: 'No contacts found'
            });
        } else {
            res.status(200).json({ contacts: contacts, currentPage: pageNumber, totalCount: count });
        }
    } catch (err) {
        res.status(500).json({
            ErrorMessage: 'Database Error Happened'
        });
    }
});

app.get('/contacts/:name', async (req, res) => {
    try {
        const contact = await Contacts.findOne(
            {
                where: { name: req.params.name }
            }
        );

        if (!contact) {
            res.status(404).json({
                message: 'No contact found with these name'
            });
        } else {
            res.status(200).json(contact);
        }
    } catch (err) {
        res.status(500).json({
            ErrorMessage: 'Database Error Happened'
        });
    }
});

app.post('/contacts', [
    body('name').notEmpty().isString(),
    body('address').notEmpty().isString(),
    body('phone_number').notEmpty().isString()
]
    , async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Bad Request, fill the form again' });
            }

            const NewContact = await Contacts.create({
                name: req.body.name,
                address: req.body.address,
                phone_number: req.body.phone_number
            });
            res.status(201).json(NewContact);
        } catch (err) {
            res.status(500).json({
                ErrorMessage: 'Internal Server Error Happened'
            });
        }
    });

app.put('/contacts', [
    body('name').optional().notEmpty().isString(),
    body('address').optional().notEmpty().isString(),
    body('phone_number').optional().notEmpty().isString()
]
    , async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Bad Request, fill the form again' });
            }

            const idToUpdate = req.query.id;
            console.log(idToUpdate);
            const [contactsUpdated] = await Contacts.update(
                {
                    name: req.body.name,
                    address: req.body.address,
                    phone_number: req.body.phone_numer
                },
                {
                    where: { id: idToUpdate }
                }
            );

            if (contactsUpdated.length == 0) {
                res.status(404).json({ failure: 'User Not Found, enter valid ID' });
            }

            res.status(200).json(`User with id: ${idToUpdate} successfully updated`);

        } catch (err) {
            res.status(500).json({
                ErrorMessage: 'Internal Server Error Happened'
            });
        }
    });

app.delete('/contacts/:id', async (req, res) => {
    try {
        const contactId = req.params.id;

        const contact = await Contacts.findOne({
            where: { id: contactId },
        });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await contact.destroy();

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Database Error Happened' });
    }
});

app.listen(3000, () => {
    console.log(`Server listening on ${api}`);
});


