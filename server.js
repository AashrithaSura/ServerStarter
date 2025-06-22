require('dotenv').config()
const express = require("express")
const app = express()
const path = require("path")
const cors = require('cors')
const cookieParser =  require('cookie-parser')

// Middleware imports
const errorHandler = require('./middleware/errorHandler')
const { logger } = require('./middleware/logEvents')
const verifyJWT = require('./middleware/verifyJWT')

// Route imports
const subDirRouter = require('./routes/subdir')
const homeRouter = require("./routes/homeRouter")
const employeeRouter = require("./routes/api/employeeRouter")
const registerRouter = require('./routes/registerRouter')
const refreshRouter = require("./routes/refreshRouter")
const authRouter = require('./routes/authRouter')
const logoutRouter = require('./routes/logoutRouter')

const PORT = process.env.PORT || 3000

// Custom middleware
app.use(logger)
app.use(require('./middleware/credentials'))

// Built-in middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use('/',express.static(path.join(__dirname, 'public')))
app.use('/subdir',express.static(path.join(__dirname, 'public')))

// CORS configuration
const whitelist = ["https://www.google.com", "http://localhost:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions))

// Routes
app.use('/', homeRouter)
app.use('/register', registerRouter)
app.use('/auth', authRouter)
app.use('/refresh', require('./routes/refreshRouter'))
app.use('/logout', require('./routes/logoutRouter'))
app.use('/api/employees', verifyJWT, employeeRouter)

app.all(/^\/.*/, (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: "404 Not Found" })
  } else {
    res.type('txt').send("404 Not Found")
  }
});

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});