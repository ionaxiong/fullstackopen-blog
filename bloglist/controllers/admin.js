const adminRouter = require("express").Router();
const { errorHandler, tokenExtractor, isAdmin } = require("../utils/middleware");
const { User, Session } = require("../models");

adminRouter.put("/:username", tokenExtractor, isAdmin, errorHandler, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (user) {
    if (req.body.disabled == true) {
      await Session.destroy({
        where: {
          userId: user.id,
        },
      });
      console.log("sessions destroyed for user : ", user.username);
    }
    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});
module.exports = adminRouter;
