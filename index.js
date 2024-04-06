// Virve Rajasärkkä 2024
// Backend Web Development: Web Framework Project (HAMK)
// A Simple RESTful API

const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

let parts = [
    { id: 3001, name: 'Brick 2x4', year: 1949 },
    { id: 3002, name: 'Brick 2x3', year: 1951 },
    { id: 3003, name: 'Brick 2x2', year: 1949 },
    { id: 3004, name: 'Brick 1x2', year: 1952 },
    { id: 3005, name: 'Brick 1x1', year: 1954 }
]

// Home
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// GET all parts
app.get('/parts', (req, res) => {
    res.render('parts', { title: 'Parts', parts: parts });
});

// GET part by id
app.get('/parts/:id', (req, res) => {
    const partId = Number(req.params.id);
    const part = parts.find(part => part.id === partId);
    if (part) {
        res.render('details', { title: partId, part: part });
    }
    else {
        res.render('error', {title: 404});
    }
});

// DELETE part by id
app.delete('/parts/:id', (req, res) => {
    const partId = Number(req.params.id);
    const part = parts.find(part => part.id === partId);
    if (part) {
        parts = parts.filter(part => part.id !== partId);
        res.status(200).json({ id: part.id });
    }
    else {
        res.status(404).json({ msg: `Part ${partId} was not found` });
    }
});

// CREATE part
app.post('/parts', (req, res) => {
    const partId = Number(req.body.id);
    const part = parts.find(part => part.id === partId);
    if (part) {
        res.status(400).json({ msg: `Part ${partId} already exists`});
    }
    else {
        const newPart = { id: partId, name: req.body.name, year: req.body.year };
        parts.push(newPart);
        res.location('http://localhost:5000/api/parts/'+partId);
        res.status(201).json(newPart);
    }
});

// UPDATE part by id
app.patch('/parts/:id', (req, res) => {
    const partId = Number(req.params.id);
    const part = parts.find(part => part.id === partId);
    if (part) {
        part.name = req.body.name;
        part.year = req.body.year;
        res.status(200).json(part);
    }
    else {
        res.status(404).json({ msg: `Part ${partId} was not found` });
    }
});

app.use(express.static('public'));

app.use((req, res, next) => {
    res.render('error', {title: 404});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));