const mongoose=require("mongoose");
const {Seat,seatSchema}=require("./Seat");
const passportLocalMongoose=require("passport-local-mongoose");
const employeeSchema=new mongoose.Schema({
    name:{
        type:String,
       
        minlength:3
    },
    email:{
        type:String,
       
    },
    password:{
        type:String,
        
        minlength:5
    },
    seat:seatSchema
});

employeeSchema.plugin(passportLocalMongoose);

const Employee=new mongoose.model("Employee",employeeSchema);

module.exports={Employee,employeeSchema};