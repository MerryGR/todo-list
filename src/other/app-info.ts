import express, {Request, Response} from 'express'
import session from 'express-session'
import dotenv from 'dotenv'

declare module 'express-session' {
    export interface SessionData {
      userprofile: { [key: string]: any };
    }
  }

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');
app.use('/css', express.static(__dirname + "/../views/css"));

app.use(session({
    secret: "AN8JHBErgkKK6bzC",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 14400000 }
  }))

const portFirst = process.argv.slice(2);
const port = portFirst[0].split('=')[1];


dotenv.config();

export {app, express, Request, Response, session, port};