const mongoose=require("mongoose");
mongoose.set ('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/employeeDB",{useNewUrlParser:true},function (err) {
    if(!err){
        console.log("connect to db");
    }else{
        console.log(err);
    }
});

