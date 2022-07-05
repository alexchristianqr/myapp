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

app.get("/users/:id", (req, res) => {
  let userId = req.params.id;
  let result = {};

  if (userId) {
    let queryUser = (item) => item.id == userId;
    result = dataUsers.find(queryUser);
  }

  // Response
  res.json({
    success: true,
    message: "user founded",
    result,
  });
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

  const user = dataUsers.find((item) => item.id == userId);
  if (!user) throw new Error("No se encontro el usuario");
  user.fullName = payload.fullName;
  // user.email = payload.email;

  // Response
  res.json({
    success: true,
    message: "user updated",
    result: user,
  });
});

app.listen(3000, () => {
  console.log("Server started on port http://localhost:3000");
});
