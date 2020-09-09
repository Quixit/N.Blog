var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

router.post(' /',passport.authenticate('bearer', { session: false }), (req, res) => {
  console.log( req);
  let imageFile = req.files.file;

  imageFile.mv(`${__dirname}/downloads/${req.body.filename}.jpg`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: `downloads/${req.body.filename}.jpg`});
  });

});

module.exports = router;
