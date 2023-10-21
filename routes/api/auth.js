const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");
const {
  register,
  login,
  getCurrentUser,
  logout,
  subscriptionRefresh,
  updateAvatar,
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
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
