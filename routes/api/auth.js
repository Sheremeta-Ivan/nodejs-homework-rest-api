const express = require("express");
const { validateBody } = require("../../middlewares");
const ctrl = require("../../controllers/auth");

const router = express.Router();
const { schemas } = require("../../validation/authValidation");

router.post(
  "/register",
  validateBody(schemas.registerValidation),
  ctrl.register
);

router.post("/login", validateBody(schemas.loginValidation), ctrl.login);

module.exports = router;
