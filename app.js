require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const app=express();
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const session=require("express-session");


require("./db/conn")
const {Employee,employeeSchema}=require("./model/Employee");
const {Seat,seatSchema}=require("./model/Seat");
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine',"ejs");
app.use(express.static("public"));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());



passport.use(Employee.createStrategy());
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());

var SeatArr=[];

app.get("/",function (req,res) {
    
    res.render("home",{seatno:10});
    
});



app.get("/register",function (req,res) {
    res.render("register");
});

app.post("/register",function (req,res) {
    Employee.register({name:req.body.name,username:req.body.username},req.body.password,function (err,user) {
        if(err){
            console.log(err);
            res.redirect("/register")
        }else{
            passport.authenticate("local")(req,res,function (params) {
                res.redirect("booking");
            })
        }
    })
});

app.get("/login",function (req,res) {
    res.render("login");
});

app.post("/login",function (req,res) {
   
    const user=new Employee({
        
        username:req.body.username,
        password:req.body.password
         
    });
    
    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function (params) {
               
                res.redirect("booking");
            })
        }
    })
    //  if(req.body.username=="root@gmail.com") {
    //     if(req.body.password==="qwerty"){
            
    //     res.redirect("/seat_manage");
    //     }
    // }else{
        
    //     res.redirect("/login");
    // }
});

// app.get("/booking",function (req,res) {
//     if(req.isAuthenticated()){
//         res.redirect("booking");
//     }else{
//         res.redirect("/login");
//     }
// });

app.get("/booking",function (req,res) {
    if(req.isAuthenticated()){
        
        Seat.find({},function (err,seats) {
            if(err){
                console.log(err);
            }else{
    
                res.render("booking",{SeatArr:seats});
            }

        });
        
        
    }else{
        res.redirect("login");
    }
    
});

app.post("/booking",function (req,res) {
    if(req.isAuthenticated()){
        Seat.findOne({_id:req.body.seatid},function (err,foundSeat) {
            if(err){
                console.log(err);
            }else{
                if(foundSeat){
                    Seat.updateOne({_id:req.body.seatid},{"status":1},function (err,temp) {
                        if(err){
                            console.log(err);
                        }else{
                            console.log(temp);
                        }
                    });
                    Employee.updateOne({username:req.user.username}, 
                        {$set:{seat:{right:foundSeat.right,
                        left:foundSeat.left,
                    _id:foundSeat._id,
                status:1}}},function (err, docs){
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log("Updated Docs : ", docs);
                    }});
                }
            }
            res.render("success",{seat:foundSeat})  
        })
        // console.log(req.user.seat);
        
    }else{
        res.redirect("/login");
    }
});



app.get("/admin",function (req,res) {
    res.render("login")
});



app.get("/seat_manage",function (req,res) {
    res.render("seat_manage");
});

app.post("/seat_manage",function (req,res) {
    const seat=new Seat({
        right:req.body.right,
        left:req.body.left,
        _id:req.body._id,
        status:req.body.status
    });
    // SeatArr.push(seat);
    // console.log(SeatArr);
    seat.save(function (err) {
        if(err){
            console.log(err);
        }else{
            res.send("Seat created !");
        }
    });
    
});


app.get("/logout",function (req,res) {
    req.logout(function (err) {
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    });
    
});

app.listen(3000,function (params) {
    console.log("server is listening on port 3000");

});