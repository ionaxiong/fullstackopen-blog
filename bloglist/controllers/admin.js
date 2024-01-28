const adminRouter = require("express").Router();
const { errorHandler, tokenExtractor, isAdmin } = require("../utils/middleware");
const { User } = require("../models");

adminRouter.put("/:username", tokenExtractor, isAdmin, errorHandler, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (user) {
    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});
module.exports = adminRouter;
