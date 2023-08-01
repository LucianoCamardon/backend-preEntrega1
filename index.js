const express = require('express');
const router = require('./src/router');
const app = express();
const port = 8080;

app.use(express.json())
router(app)

app.listen(port,()=>{
    console.log(`Server opened at port ${port}`)
})