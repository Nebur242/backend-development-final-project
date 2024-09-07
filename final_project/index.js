const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customerRoutes = require("./router/auth-users.js").authenticated;
const generalRoutes = require("./router/general.js").general;
const axiosRoutes = require("./router/axios-routes.js").axiosRouter;

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  try {
    const { accessToken, username } = req.session.authorization;

    // check token integrity
    if (!accessToken) {
      throw new Error("Unauthorized");
    }

    const { password } = jwt.verify(accessToken, "access");

    req.user = {
      username,
      password,
    };

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "User not authenticated" });
  }
});

app.use("/customer", customerRoutes);
app.use("/", generalRoutes);
app.use("/axios", axiosRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => console.log("Server is running"));
