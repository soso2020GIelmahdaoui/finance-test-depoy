const mongoose =require( "mongoose");

 const connectDb=async()=>{
  
    try{
      await mongoose.connect(process.env.MONGO_URL||'',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
      console.log('Connected to MongoDB')
    }catch(error){
        console.error("Could not connect to MongoDB", error); 
    }
}


module.exports = connectDb ;