import express from 'express'
import cors from 'cors'



const app = express()
const PORT = 3000

app.use(cors({
  origin: "http://localhost:5174",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`)
})
