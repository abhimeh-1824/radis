const app = require("./index");
const connect = require("./config/db");
const port = 5000;

app.listen(port,async()=>{
    try {
        await connect()
        console.log(`port is working on ${port}`)
    } catch (error) {
        throw error
    }
})