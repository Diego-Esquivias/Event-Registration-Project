const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 5000
const path = require('path');

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Load tasks from JSON file
const getTasks = () => {
    const data = fs.readFileSync('./data/tasks.json', 'utf8');
    return JSON.parse(data);
}

const getEvents = () => {
    const data = fs.readFileSync('./data/events.json', 'utf8');
    return JSON.parse(data);
}

const saveTasks = (tasks) => {
    fs.writeFileSync('./data/tasks.json', JSON.stringify(tasks, null, 2));
};

const saveEvents = (events) => {
    fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2));
};

// Routes

// GET: Show all tasks
app.get('/', (req, res) => {
    const tasks = getTasks();
    res.render('events', { tasks });
});

app.get('/admin', (req, res) => {
    const tasks = getTasks();
    const events = getEvents();
    res.render('index', { tasks, events });
});

// POST: Add new task
app.post('/tasks', (req, res) => {
    const tasks = getTasks();
        const newTask = {
            id: tasks.length + 1,
            carMake: req.body.carMake,
            carDate: req.body.carDate,
            carDoor: req.body.carDoor,
            carLocation: req.body.carLocation,
            carWeight: req.body.carWeight
        };
        tasks.push(newTask);
        saveTasks(tasks);
        res.redirect('/');
})

// POST: Add new user to register for an event
app.post('/events', (req, res) => {
    const events = getEvents();
        const newEvent = {
            id: Number(req.body.id),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
        };
        events.push(newEvent);
        saveEvents(events);
        res.redirect('/');
})

// GET: Show a single task (for editing)
app.get('/tasks/:id/edit', (req, res) => {
    const tasks = getTasks();
    const task = tasks.find(task => task.id == req.params.id);
    res.render('tasks', { task });
})

// PUT: Update a task
app.post('/tasks/:id', (req, res) => {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id == req.params.id);
    tasks[taskIndex].carDoor = req.body.carDoor;
    tasks[taskIndex].carMake = req.body.carMake;
    tasks[taskIndex].carDate = req.body.carDate;
    tasks[taskIndex].carLocation = req.body.carLocation;
    tasks[taskIndex].carWeight = req.body.carWeight;
    saveTasks(tasks);
    res.redirect('/');
})

// DELETE: Delete a task
app.post('/tasks/:id/delete', (req, res) => {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id != req.params.id);
    saveTasks(tasks);
    res.redirect('/');
})

// SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});