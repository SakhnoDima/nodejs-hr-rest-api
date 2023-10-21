const express = require("express");

const router = express.Router();
const {
  getAll,
  getById,
  add,
  remove,
  updateById,
  updateFavorite,
} = require("../../controllers/contacts.js");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/contact.js");

router.use(authenticate);

router.get("/", getAll);

router.get("/:contactId", isValidId, getById);

router.post("/", validateBody(schemas.addSchema), add);

router.delete("/:contactId", isValidId, remove);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.updateSchema),
  updateById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavorite),
  updateFavorite
);
module.exports = router;
