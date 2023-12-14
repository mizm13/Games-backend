

import express from 'express'
import cors from 'cors'
import games from './api/games.route.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/mm355/games", games)

app.use('*', (req,res) => {
  res.status(404).json({error: "not found"})
})

export default app
