// require("dotenv").config();

// const { Sequelize } = require("sequelize");
// // import pg from 'pg';
// const { Pool } = require('pg');


// const fs = require('fs');
// const path = require('path');
// const {
//   DB_USER, DB_PASSWORD, DB_HOST,
// } = process.env;

// // const pool = new Pool({
// //   connectionString: process.env.DATABASE_URL
// // });

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/vamosdatabase`, {
//   logging: false, 
//   native: false, 
// });

// // const sequelize = new Sequelize(process.env.DATABASE_URL, {
// //   logging: false,
// //   native: false,
// //   dialectOptions: {
// //     ssl: true,
// //   },
// // });
// const basename = path.basename(__filename);

// const modelDefiners = [];

// fs.readdirSync(path.join(__dirname, '/models'))
//   .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
//   .forEach((file) => {
//     modelDefiners.push(require(path.join(__dirname, '/models', file)));
//   });


// // modelDefiners.forEach(model => model(sequelize));

// let entries = Object.entries(sequelize.models);
// let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
// sequelize.models = Object.fromEntries(capsEntries);


// const { User, Admin, Avatar } = sequelize.models;



// module.exports = {
//   ...sequelize.models,
//   conn: sequelize,
// };

require("dotenv").config();
const { Sequelize } = require("sequelize");


const fs = require('fs');
const path = require('path');
const { 
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;
console.log("env" , DB_HOST, DB_USER)
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/rgames`, {
  logging: false, 
  native: false, 
});
const basename = path.basename(__filename);

const modelDefiners = []; 

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
      const model = require(path.join(__dirname, '/models', file));
      console.log(`Cargando modelo: ${file}`); // Añade esta línea para depurar
      modelDefiners.push(model);
  });



 modelDefiners.forEach(model => model(sequelize));  

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { User, Game} = sequelize.models;
User.belongsToMany(Game, { through: 'UserFavGames' });
Game.belongsToMany(User, { through: 'UserFavGames' });



module.exports = {
  ...sequelize.models, 
  conn: sequelize,     
};