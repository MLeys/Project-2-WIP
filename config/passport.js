const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//Require your User Model here!

// configuring Passport!
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, cb) {
    // a user has logged in via OAuth!
    // refer to the lesson plan from earlier today in order to set this up

  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(employeeId, done){
  // this function opens up the session cookie,
  // grabs the userId, ^ the argument userId, is from the session cookie
  // and will attach the user document to req.user, 
  // which will be abailible in every single controller function
  User.findById(employeeId, function(err, employeeDoc){
    if(err) return done(err);
    done(null, employeeDoc); // this assigns the user document that we just found from the database to req.user
  // req.user = userDocemployee})
  })
})


// passport.deserializeUser(function(id, done) {

  // Find your User, using your model, and then call done(err, whateverYourUserIsCalled)
  // When you call this done function passport assigns the user document to req.user, which will 
  // be availible in every Single controller function, so you always know the logged in user

// });



