import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './models/sequelizeConfig.js';
import path from 'path';
const __dirname = path.resolve();
import exphbs from "express-handlebars"

dotenv.config();

const app = express();
// const port = 3001;
// const { API_PORT } = process.env;
// const port = process.env.PORT || API_PORT;

const port = process.env.PORT || 3001;

const corsOptions = {
  allowedHeaders: ['ngrok-skip-browser-warning', 'Content-Type'],
};

// sequelize.sync();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to parse JSON data
app.use(express.static('public'));
app.use(cors(corsOptions));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(express.static("images"));

sequelize.sync({alter: true});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});