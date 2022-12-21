const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", (req, res) => {
  axios
    .post(
      "https://api.diffchecker.com/public/text?output_type=html&email=lorencianodramayo@gmail.com",
      req.body
    )
    .then((response) =>
      axios
        .post(
          "https://api.diffchecker.com/public/text?output_type=json&email=lorencianodramayo@gmail.com",
          req.body
        )
        .then((resJson) =>
          res.status(200).json({
            code: response?.data,
            details: {
              lines: resJson.data?.rows,
              added: resJson?.data?.added,
              removed: resJson?.data?.removed,
            },
          })
        )
    );
});

module.exports = router;
