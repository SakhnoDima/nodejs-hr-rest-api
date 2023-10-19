const express = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const {
  register,
  login,
  getCurrentUser,
  logout,
  subscriptionRefresh,
} = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.userJoiSchema), register);
router.post("/login", validateBody(schemas.userJoiSchema), login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrentUser);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.subscriptSchema),
  subscriptionRefresh
);

module.exports = router;
