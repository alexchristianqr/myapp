const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dataUsers = [
  {
    id: 1,
    fullName: "Alex Christian",
    email: "alexchristian@gmail.com",
  },
];

app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  // Response
  res.json({ message: "Welcome to the API" });
});

app.get("/users", (req, res) => {
  let payload = req.query;
  let result = [];

  if (payload.search) {
    const queryUser = (item) => {
      return (
        item.id.toString().indexOf(payload.search) > -1 ||
        item.fullName.toString().indexOf(payload.search) > -1 ||
        item.email.toString().indexOf(payload.search) > -1
      );
    };
    result = dataUsers.filter(queryUser);
  } else {
    result = dataUsers;
  }

  // Response
  res.json({
    success: true,
    message: "users filtered",
    result,
  });
});

app.get("/users/:id", (req, res) => {
  let userId = req.params.id;
  let result = {};

  if (userId) {
    let queryUser = (item) => item.id.toString() === userId.toString();
    result = dataUsers.find(queryUser);
  }

  // Response
  res.json({
    success: true,
    message: "user founded",
    result,
  });
});

app.post("/users", (req, res) => {
  let payload = req.body;
  let userId = dataUsers.length + 1;

  dataUsers.unshift({
    id: userId,
    fullName: `${userId}-${payload.fullName}`,
    email: `${payload.fullName.toLowerCase().split(" ").join("")}@gmail.com`,
  });

  // Response
  res.json({
    success: true,
    message: "user created",
    result: dataUsers,
  });
});

app.put("/users/:id", (req, res) => {
  let userId = req.params.id;
  let payload = req.body;

  let user = dataUsers.find((item) => item.id.toString() === userId.toString());
  if (!user) throw new Error("No se encontro el usuario");
  for (let item in user) {
    if (!item || item === "id") continue;
    user[item] = payload[item];
  }

  // Response
  res.json({
    success: true,
    message: "user updated",
    result: user,
  });
});

app.patch("/users/:id", (req, res) => {
  let userId = req.params.id;
  let payload = req.body;

  let user = dataUsers.find((item) => item.id.toString() === userId.toString());
  if (!user) throw new Error("No se encontro el usuario");
  for (let item in user) {
    const field = Object.keys(payload).find((subitem) => subitem === item);
    if (!field || field === "id") continue;
    user[field] = payload[field];
  }

  // Response
  res.json({
    success: true,
    message: "user updated field",
    result: user,
  });
});

app.listen(3000, () => {
  console.log("Server started on port http://localhost:3000");
});
