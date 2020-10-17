// Use nodemon for automatic compilation changes same as spring devtools.
const Joi = require('joi');
const express = require('express');

const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'Java' },
    { id: 2, name: 'Node' },
    { id: 3, name: 'React' },
    { id: 4, name: 'Springboot' }
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// Using routing parameters or path params
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(corse => corse.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send('Course not found.');
    }
    res.send(course);
});

// Using routing parameters or query params
app.get('/api/query', (req, res) => {
    res.send(req.query);
});

// Using environment variables.
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening port ${port}`);
});

// Handling POST requests
app.post('/api/course', (req, res) => {
    validateRequest(req.body, res);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// Handling PUT requests
app.put('/api/course', (req, res) => {
    validateRequest(req.body, res);
    const foundCourse = courses.find(course => course.id === parseInt(req.body.id));
    if(!foundCourse){
        res.status(404).send('Course not found.');
    }

    foundCourse.name = req.body.name;
    res.send(foundCourse);
});

// Handling DELETE requests
app.delete('/api/course/:id', (req, res) => {
    const foundCourse = courses.find(course => course.id === parseInt(req.params.id));
    if(!foundCourse) {
        res.status(404).send('Course not found.');
    }
    courses.splice(courses.indexOf(foundCourse), 1);
    res.send(`Course with id ${req.params.id} is deleted.`);
});

function validateRequest(requestBody, res){
    const schema = Joi.object({
        id: Joi.required(),
        name: Joi.string().min(3).required()
    });

    const validateResult = schema.validate(requestBody);
    
    if(validateResult.error) {
        res.status(400).send(validateResult.error.details[0].message);
        return;
    }
}