const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const musicSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    singer:{
        type:String
        // type: Schema.Types.ObjectId,
        // ref:'Singer'
    },
    songURL:{
        type:String,
        required:true
    },
    songImg:{
        type:String
    }
});

module.exports=new mongoose.model("Music",musicSchema);
