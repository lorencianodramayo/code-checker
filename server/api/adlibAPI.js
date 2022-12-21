const express = require("express");
const router = express.Router();

const { getPlatform } = require("../utils/adlib");

const PlatformModel = require("../models/PlatformModel");

router.get("/", (req, res) => {
  let arr = [];

  Object.values(req.query).map(async (data) => {
    const platformResult = await getPlatform({
      platform: data.split("/")[2].includes("app") ? "app" : "beta",
      conceptId: data.split("/")[4],
      templateId: data.split("/")[6],
    });
    arr.push(platformResult);

    if (arr.length === 2) {
      const platformSave = new PlatformModel({
        links: req.query,
        platform: arr,
      });

      platformSave.save((error, result) => {
        if (error) {
          return res.status(500).json({ msg: "Sorry, internal server errors" });
        }

        return res.status(200).json(result);
      });
    }
  });
});

router.get("/getPlatform", (req, res) => {
  PlatformModel.findById(req?.query?.codeId, (err, success) => {
    return err
      ? res.status(500).json({ msg: "Sorry, Internal server error" })
      : res.json(success);
  }).sort([["_id", 1]]);
});

module.exports = router;