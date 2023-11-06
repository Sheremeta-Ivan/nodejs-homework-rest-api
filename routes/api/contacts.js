const express = require("express");
const ctrl = require("../../controllers/contacts");

const { validateBody } = require("../../middlewares");
const { addSchema } = require("../../schemas");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getById);

router.post("/", validateBody(addSchema), ctrl.addContact);

router.put("/:contactId", validateBody(addSchema), ctrl.updateContact);

router.delete("/:contactId", ctrl.deleteContact);

module.exports = router;
