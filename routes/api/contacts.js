const express = require("express");

const router = express.Router();
const {
  getAll,
  getById,
  add,
  remove,
  updateById,
} = require("../../controllers/contacts.js");

const { validateBody } = require("../../middlewares");

const { addSchema, updateSchema } = require("../../schemas/contactsSchemas.js");

router.get("/", getAll);

router.get("/:contactId", getById);

router.post("/", validateBody(addSchema), add);

router.delete("/:contactId", remove);

router.put("/:contactId", validateBody(updateSchema), updateById);

module.exports = router;
