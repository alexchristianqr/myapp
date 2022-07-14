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

const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
// const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const idGroupCognito = "us-east-1_CLt3LBEVl";
const idAppClientCognito = "5oqodu3j7jio2uvmcmd4dh874g";
const regionUS = "us-east-1";

app.use(bodyParser.json());
app.use(morgan("dev"));

// TODO: public routes

/*
  https://github.com/aws-amplify/amplify-js/tree/main/packages/amazon-cognito-identity-js
 */

app.get("/", (req, res) => {
  // Response
  res.json({ message: "Welcome to the API" });
});

app.post("/login", (req, res) => {
  // Set request
  const payload = req.body;
  if (!payload.email || !payload.password) {
    return res.status(400).json({ message: "Faltan parametros" });
  }

  // Validar identidad de los datos en AWS
  let authenticationData = {
    Username: payload.email,
    Password: payload.password,
  };
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );

  // Validar grupo de usuario en AWS cognito
  let poolData = {
    UserPoolId: idGroupCognito, // Your user pool id here
    ClientId: idAppClientCognito, // Your client id here
  };
  let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  // Validar usuario en AWS cognito
  let userData = {
    Username: payload.email,
    Pool: userPool,
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // Iniciar sesion con AWS Cognito
  return cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      // Response
      return res.status(200).json({
        success: true,
        message: "Logged in new access token",
        result: result,
      });
    },
    onFailure: (err) => {
      return res.status(400).json({
        success: false,
        message: err,
      });
    },
    // mfaRequired: function(codeDeliveryDetails) {
    //   // MFA is required to complete user authentication.
    //   // Get the code from user and call
    //   cognitoUser.sendMFACode(payload.mfaCodeVerification, this)
    // },
  });
});

app.post("/signup", (req, res) => {
  // Set request
  const payload = req.body;
  if (!payload.email || !payload.password) {
    return res.status(400).json({ message: "Faltan parametros" });
  }

  // Validar grupo de usuario en AWS cognito
  const poolData = {
    UserPoolId: idGroupCognito, // Your user pool id here
    ClientId: idAppClientCognito, // Your client id here
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  const attributeList = [];

  // Set datos del nuevo usuario
  const attributeName = new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: "name",
    Value: payload.fullName,
  });
  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: "email",
    Value: payload.email,
  });
  attributeList.push(attributeName);
  attributeList.push(attributeEmail);

  // Registrar nuevo usuario y enviar codigo de confirmación
  userPool.signUp(
    payload.email.toString(),
    payload.password.toString(),
    attributeList,
    null,
    function (err, result) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err,
        });
      }

      // Response
      return res.status(200).json({
        success: true,
        message: "Registered new user",
        result: result.user,
      });
    }
  );
});

app.post("/signup/confirm", (req, res) => {
  // Set request
  const payload = req.body;
  if (!payload.email || !payload.codeVerification) {
    return res.status(400).json({ message: "Faltan parametros" });
  }

  // Validar grupo de usuario en AWS cognito
  const poolData = {
    UserPoolId: idGroupCognito, // Your user pool id here
    ClientId: idAppClientCognito, // Your client id here
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  // Validar usuario en AWS cognito
  let userData = {
    Username: payload.email,
    Pool: userPool,
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // Confirmar codigo de verificación
  cognitoUser.confirmRegistration(
    payload.codeVerification,
    true,
    function (err, result) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err,
        });
      }

      // Response
      return res.status(200).json({
        success: true,
        message: "Confirmed user registered",
        result: result,
      });
    }
  );
});

app.post("/signup/resend", (req, res) => {
  // Set request
  const payload = req.body;
  if (!payload.email) {
    return res.status(400).json({ message: "Faltan parametros" });
  }

  // Validar grupo de usuario en AWS cognito
  const poolData = {
    UserPoolId: idGroupCognito, // Your user pool id here
    ClientId: idAppClientCognito, // Your client id here
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  // Validar usuario en AWS cognito
  let userData = {
    Username: payload.email,
    Pool: userPool,
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // Reenviar código de verificación
  cognitoUser.resendConfirmationCode(function (err, result) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err,
      });
    }

    // Response
    return res.status(200).json({
      success: true,
      message: "Sent confirm code for new user registered",
      result: result,
    });
  });
});

app.get("/auth/user", (req, res) => {
  // Set request
  const payload = req.query;
  if (!payload.email || !payload.password) {
    res.status(400).json({ message: "Faltan parametros" });
  }

  // Validar grupo de usuario en AWS cognito
  let poolData = {
    UserPoolId: idGroupCognito, // Your user pool id here
    ClientId: idAppClientCognito, // Your client id here
  };
  let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  // Validar usuario en AWS cognito
  let userData = {
    Username: payload.email,
    Pool: userPool,
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // Obtener datos de usuario autenticado
  cognitoUser.getUserAttributes(function (err, result) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err,
      });
    }

    // Response
    return res.status(200).json({
      success: true,
      message: "user attributes",
      result: result,
    });
  });
});

app.delete("/auth/user", (req, res) => {
  // Set request
  const payload = req.body;
  if (!payload.email || !payload.password) {
    res.status(400).json({ message: "Faltan parametros" });
  }

  // Validar grupo de usuario en AWS cognito
  let poolData = {
    UserPoolId: idGroupCognito, // Your user pool id here
    ClientId: idAppClientCognito, // Your client id here
  };
  let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  // Validar usuario en AWS cognito
  let userData = {
    Username: payload.email,
    Pool: userPool,
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // Eliminar usuario
  cognitoUser.deleteUser(function (err, result) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err,
      });
    }

    // Response
    return res.status(200).json({
      success: true,
      message: "user deleted",
      result: result,
    });
  });
});

// TODO: private routes

app.post("/logout", (req, res) => {
  // Set request
  const payload = req.body;
  if (!payload.email || !payload.password) {
    res.status(400).json({ message: "Faltan parametros" });
  }

  // Validar grupo de usuario en AWS cognito
  let poolData = {
    UserPoolId: idGroupCognito, // Your user pool id here
    ClientId: idAppClientCognito, // Your client id here
  };
  let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  // Validar usuario en AWS cognito
  let userData = {
    Username: payload.email,
    Pool: userPool,
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // Cerrar sesión
  cognitoUser.signOut(() => {
    // Response
    return res.status(200).json({
      success: true,
      message: "Logout user",
    });
  });
  // cognitoUser.globalSignOut();
});

app.get("/users", (req, res) => {
  let payload = req.query;
  let result;

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
  res.status(200).json({
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
  res.status(200).json({
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
  res.status(200).json({
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
  res.status(200).json({
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
  res.status(200).json({
    success: true,
    message: "user updated field",
    result: user,
  });
});

app.listen(3000, () => {
  console.log("Server started on port http://localhost:3000");
});
