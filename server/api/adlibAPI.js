const express = require("express");
const router = express.Router();

const { getPlatform } = require("../utils/adlib");

const PlatformModel = require("../models/PlatformModel");

router.get("/", (req, res) => {
  let zipPlatform = [];
  let overviewPlatform = [];

  Object.values(req.query).map(async (data, index) => {
    const platformResult = await getPlatform({
      platform: data.split("/")[2].includes("app") ? "app" : "beta",
      conceptId: data.split("/")[4],
      templateId: data.split("/")[6],
      variant: `template_${index + 1}`,
    });

    zipPlatform.push(platformResult?.zip);
    overviewPlatform.push(platformResult?.overview);

    if (zipPlatform.length === 2 && overviewPlatform.length === 2) {
      const platformSave = new PlatformModel({
        links: req.query,
        platform: zipPlatform,
        overview: overviewPlatform,
      });

      platformSave.save((error, result) => {
        if (error) {
          return res.status(500).json({ msg: `Platform Save: ${error}` });
        }

        return res.status(200).json(result);
      });
    }
  });
});

router.get("/getPlatform", (req, res) => {
  PlatformModel.findById(req?.query?.codeId, (err, success) => {
    return err
      ? res.status(500).json({ msg: `GET Platform: ${err}` })
      : res.json(success);
  }).sort([["_id", 1]]);
});

module.exports = router;
