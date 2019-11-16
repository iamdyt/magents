const express = require('express')
const logger = require ('morgan')
const option = require('./knexoption')
const knex = require('knex')(option)
const app = express()
const os = require('os')
const network = require ('network')

const PORT = process.env.PORT | 5000;
app.use(logger('short'))

// Registration endpoints

app.get('/register/:username/:password', async(req,res)=>{
    const {username,password} = req.params;
    const reg = await knex('user').insert({username,password})
    if (reg){
        res.send('Registration Successful, Login to continue');
    }
})

//Login endpoints

app.get('/login/:username/:password',async(req,res)=>{
    const {username, password} = req.params;
    const cred =  await knex('user').select('*').where({
        'username':username,
        'password':password
    })
    res.send(cred[0])
})

//System properties

app.get('/system',(req,res)=>{
    const hostName = os.hostname()
    const platform = os.platform()
    const totalmem = os.totalmem()
    const arch = os.arch()
    const interface = network.get_active_interface((err,obj)=>{

        res.send({hostName,platform,totalmem,arch,obj})
    })    
})

//All Doctors
app.get('/doctors',async(req,res)=>{
    const doctors = await knex('doctor').select('*')
    res.send(doctors)
})

// Single Doctor

//All Patients
app.get('/patients',async(req,res)=>{
    const patients = await knex('patient').join('doctor','patient.doctor','doctor.id').select('*')
    res.send(patients)
})



app.listen(PORT, ()=>{
    console.log ("Server Started Succesfully")
})
