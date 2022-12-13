const mongoose=require("mongoose");

const seatSchema=new mongoose.Schema({
    right:Number,
    left:Number,
    _id:Number,
    status:Number
});


const Seat=new mongoose.model("Seat",seatSchema);


module.exports={Seat,seatSchema};