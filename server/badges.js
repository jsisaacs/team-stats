const express = require("express");
const router = express.Router();
const rp = require("request-promise");

router.get("/badges/:summonerName", (req, res) => {
    res.json("SUCCESS!")
});

module.exports = router;