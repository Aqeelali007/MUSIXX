import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import passport from "passport";
import session from "express-session";
import path from "path";
import { fileURLToPath } from 'url';
import "./strategies/google_strategy.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 10 * 60}
}));

app.use(passport.initialize());
app.use(passport.session());




app.get("/", (req, res) => {
    // console.log("Session before accessing /:", req.session);
    if (req.isAuthenticated()) {
        return res.redirect('/profile'); 
    }
    res.redirect('/login');
});

app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get("/auth/google/callback", passport.authenticate('google'), (req, res) => {
    req.session.user = req.user;
    // console.log(req.user);
    res.redirect('/profile');
});

function isAuthenticated(req, res, next) {
    console.log("inside middleware function");
    if (req.isAuthenticated()) {
        console.log("user is authenticated");
        return next();
    }
    console.log("returning to login");
    res.redirect('/login');
}



app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/profile", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.session.destroy(err => {
            if(err) { 
                res.redirect('/profile');
                return next(err);}
        
        })
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.get("/api/user",(req,res) => {
    console.log('inside route');
    if(req.session.user){
        // console.log(req.session.user);
        res.json(req.session.user);
    }
    else{
        res.send('not authenticated');
    }
});

app.use(express.static(path.join(__dirname, 'public')));



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});