const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const ctrl = require("../../controllers/auth");

const router = express.Router();
const { schemas } = require("../../validation/authValidation");

router.post(
  "/register",
  validateBody(schemas.registerValidation),
  ctrl.register
);
router.get("/verify/:verifyToken", ctrl.verifyEmail);

router.post(
  "/verify",
  validateBody(schemas.repeatEmailVerifyValidation),
  ctrl.repeatEmailVerify
);

router.post("/login", validateBody(schemas.loginValidation), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/subscription", authenticate, ctrl.patchSubscription);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
