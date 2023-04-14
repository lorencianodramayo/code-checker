const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const response = await axios.post(
      "https://api.diffchecker.com/public/text?output_type=html&email=hazel.dimaano@smartly.io",
      req.body
    );

    try {
      const resJson = await axios.post(
        "https://api.diffchecker.com/public/text?output_type=json&email=hazel.dimaano@smartly.io",
        req.body
      );

      res.status(200).json({
        code: response?.data,
        details: {
          lines: resJson.data?.rows,
          added: resJson?.data?.added,
          removed: resJson?.data?.removed,
        },
      });
    } catch (e) {
      console.log(e);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
