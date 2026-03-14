import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import authRouter from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
const PORT = process.env.PORT || 5000
dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.get("/", (req, res) => {
  res.json({ message: "Backend running" })
})

app.use('/api/auth',authRouter)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})