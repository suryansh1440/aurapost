import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import authRoute from "./routes/auth.route.js"
import workspaceRoute from "./routes/workspace.route.js"

dotenv.config()

const app = express()

app.use(cors(
    {
        origin: ["http://localhost:5173", process.env.FRONTEND_URL],
        credentials: true
    }
))

app.use(express.json())
app.use(cookieParser())


// routes
app.use("/api/auth", authRoute);
app.use("/api/workspaces", workspaceRoute);



app.get("/", (req, res) => {
    res.send("Hello World!")
})
const PORT = process.env.PORT

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
}).catch((err) => {
    console.log("error connecting to database", err)
})

export default app