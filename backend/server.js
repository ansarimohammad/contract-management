import express from 'express'
import cors from 'cors'



const app = express()
const PORT = 3000

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.get('/api', (req, res) => {
  res.send('Hello World! This is /api route Thank You for Testing')
})


app.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`)
})
