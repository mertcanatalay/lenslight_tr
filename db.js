import mongoose from "mongoose";

const conn = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: 'lenslight_tr',
        useNewUrlParser: true,
        useUnifiedTopology  : true,
    }).then(()=>{
        console.log("connected to db succesfully")
    }).catch((err)=>{
        console.log(`db connection err:,${err}`)
    })
}

export default conn;