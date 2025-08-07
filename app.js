import connection from './config/connection.js'
import express from 'express'
import user from './src/users/routes/user.js'
import service from './src/services/routes/services.js'
//connect to Database

const app = express()
app.use(express.json())

app.use('/users',user)
app.use('/services',service)

connection().then(() =>{
    app.listen(process.env.PORT,() => {
        console.log(`Server running in port ${process.env.PORT}`)
    })
}).catch(err => {
    console.error('Error on starting server')
})
