const express = require('express');
const fs = require('fs');
const port = 3000;

const dbName = 'db.txt'

const app = express();

app.use(express.json())

let db = []
function loadDb(){
    try{
        const file = fs.readFileSync(dbName, 'utf8');
        if(file) db = JSON.parse(file.toString());
    } catch(err){
        console.log(err)
    }
}

function saveDb(){
    fs.writeFileSync(dbName, JSON.stringify(db));
}

app.get('/', (request, response) => {
    const { nombre } = request.query;
    let results = [];
    if(nombre){
        results = db.filter(student =>{
            return student
                .nombre.toLowerCase()
                .includes(nombre.toLowerCase())
            })
    } else {
        results = db;
    }
    return response.json(results);
})

app.get('/:id', (request, response) => {
    let results = db.find(student => {
        return student.id == request.params.id
    })

    if(!results){
        return response.status(404).json(
            { mensaje: 'User not found' }
        )
    }
    return response.json(results);
})


app.post('/student', (request, response)=>{
    const {body} = request
    if(!body.nombre){
        return response.status(400).json({
            message: 'Field name must be provided',
            ok: false
        })
    }

    if(body.nombre.length < 3){
        return response.status(400).json({
            message: 'Name must be more than 3 characters long',
            ok: false
        })
    }
    const lastId = db[db.length - 1]?.id || 0
    const newStudent = {
        id: lastId + 1,
        ...request.body
    }
    db.push(newStudent)
    saveDb()
    return response.status(201).json({id:newStudent.id })
})

app.listen(port, async () => {
    loadDb();
    return console.log(`Hi we are in port ${port}`)
})