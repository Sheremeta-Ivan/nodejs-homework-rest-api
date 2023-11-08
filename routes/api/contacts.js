const express = require("express");
const ctrl = require("../../controllers/contacts");

const { validateBody } = require("../../middlewares");
const { validationSchema } = require("../../validation");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getById);

router.post("/", validateBody(validationSchema), ctrl.addContact);

router.put("/:contactId", validateBody(validationSchema), ctrl.updateContact);

router.delete("/:contactId", ctrl.deleteContact);

module.exports = router;
