//Require modules
const express = require("express");
const cors = require("cors");
const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const auth = require("./jwt-strategy");
const bcrypt = require("bcrypt");
require("dotenv").config();

//Setup Modules
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
auth(knex).initialize();

//Route
app.post("/auth/signup", async (req, res) => {
  // const username = req.body.username;
  // const password = req.body.password;
  const { username, password } = req.body;
  console.log(username, password);
  let query = await knex("users").where({ username }).first();
  const hashed = await bcrypt.hash(password, 10);
  if (query == undefined) {
    await knex("users").insert({ username, password: hashed });
    //same as     await knex("users").insert({ username: username, password: hashed });
    res.json("signup complete");
  } else {
    res.sendStatus(401);
  }
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  let user = await knex("users").where({ username }).first();

  if (user) {
    let result = await bcrypt.compare(password, user.password);

    if (result) {
      const payload = {
        id: user.id,
        username: user.username,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.sendStatus(401);
    }
  }
});

app.get("/todo", async (req, res) => {
  let token = req.headers.authorization;
  var decoded = jwt_decode(token);
  token = token.replace("Bearer ", "");
  let verify = jwt.verify(token, process.env.JWT_SECRET);
  if (verify) {
    res.json({
      todo: ["get bottle of water", "water plants", "eat breakfast"],
    });
  } else {
    res.sendStatus(401);
  }
});



app.get("/showToDoList", async (req, res) => {
  let token = req.headers.authorization;
  var decoded = jwt_decode(token);
  token = token.replace("Bearer ", "");
  let verify = jwt.verify(token, process.env.JWT_SECRET);
  let lists = await knex("lists").where({ user_id: decoded.id }).select("id","list").orderBy('id');
  // console.log(lists)
  // let listsArray = [];
  // for (let i = 0; i < lists.length; i++) {
  //   listsArray.push(lists[i].list);
  // }
  if (verify) {
    res.json({
      todo: [lists],
    });
  } else {
    res.sendStatus(401);
  }
});


app.post("/addToDoList", async (req, res) => {
  const { list } = req.body;
  let decoded = jwt_decode(req.body.token);
  let add = await knex('lists').insert({ user_id: decoded.id, list: list });
  let token = req.body.token;
  token = token.replace("Bearer ", "");
  let verify = jwt.verify(token, process.env.JWT_SECRET);
  if (verify) {
    console.log(`added ${list} to DB`)
    let lists = await knex("lists").where({ user_id: decoded.id }).select("id","list").orderBy('id');
    res.send(lists)
    return add;
  } else {
    res.sendStatus(401);
  }
});


app.post("/deleteToDoList", async (req, res) => {
  console.log(req.body)
  let token = req.body.token;
  token = token.replace("Bearer ", "");
  let verify = jwt.verify(token, process.env.JWT_SECRET);
  if (verify) {
    await knex('lists').where("id", req.body.id).del();
    console.log(`deleted ${req.body.id}`)
  } else {
    res.sendStatus(401);
  }
});

app.post("/editToDoList", async (req, res) => {
  let token = req.body.token;
  let decoded = jwt_decode(req.body.token);
  token = token.replace("Bearer ", "");
  let verify = jwt.verify(token, process.env.JWT_SECRET);
  if (verify) {
    await knex('lists').where('id', req.body.id).update("list", req.body.edit)
    console.log(`updated ${req.body.id}`)
    let lists = await knex("lists").where({ user_id: decoded.id }).select("id","list").orderBy('id');
    res.send(lists)
  } else {
    res.sendStatus(401);
  }
});



app.listen(8000, () => console.log("Listening to port 8000"));
