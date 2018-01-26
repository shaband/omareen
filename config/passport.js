const localStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
require('../models/Users');
const user = mongoose.model('Users');

const login =function(passport){
    passport.use(new localStrategy({usernameField:'email'},(email,password,done)=>{
        console.log(email);
        console.log(password);
        user.findOne({
            email:email,
        }).then((user)=>{
            //console.log(user);
            if(!user){
                console.log('not Found');
                return done(null,false,{message:"no user found"});
            }
            bcrypt.compare(password, user.password).then(isMatch=>{
                console.log('passMatch');
                
                if(isMatch){
                    console.log('error here');

                return done(null,user,{message:"logged in  successfully"});
                }else{
                    console.log('here');

                    return done(null, false, { message: "wrong password" });

                }
            }).catch(err => console.log(err));
            
      //    return done(null, false, { message: "no user found" });

        });
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        user.findById(id, function (err, user) {
            done(err, user);
        });
    });


};
module.exports=login;
