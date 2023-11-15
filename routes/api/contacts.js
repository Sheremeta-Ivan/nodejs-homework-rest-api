const express = require("express");
const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middlewares");
const {
  contactsValidation,
  updateFavorites,
} = require("../../validation/contactsValidation");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getById);

router.post("/", validateBody(contactsValidation), ctrl.addContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(contactsValidation),
  ctrl.updateContactById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(updateFavorites),
  ctrl.updateFavorite
);

router.delete("/:contactId", isValidId, ctrl.deleteContact);

module.exports = router;
