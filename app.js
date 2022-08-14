import express from "express";

const app = express();
const port = 3000;

app.get("/", (req,res) => {
    res.send("index sayfası 2");
});

app.listen(port,()=>{
    console.log(`application runing on port: ${port}`)
});