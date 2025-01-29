const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(
  session({ secret: "secret-session", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

const client_id =
  "228213337994-et0da7ui1hqmnjbfokgjk4kh1r14c2o6.apps.googleusercontent.com";
const client_secret = "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";
const redirect_url = "http://localhost:5000/auth/google/callback";

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "228213337994-et0da7ui1hqmnjbfokgjk4kh1r14c2o6.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Find or create user in your DB
      // Here, for simplicity, we'll assume the user is created
      const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
      };
      console.log(user);
      return done(null, user);
    }
  )
);

// Serialize user info into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'><button>Login with Google</button></a>");
});

// Route to start Google authentication
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback route after Google authentication
app.get(
  "auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful login, redirect to home
    res.redirect("/");
  }
);

app.listen(5000, () => {});
