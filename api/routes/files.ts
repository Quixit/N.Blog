import express from 'express';
import passport from 'passport';

const router = express.Router();

router.post(' /',passport.authenticate('bearer', { session: false }), (req: any, res) => {
  console.log( req);
  let imageFile = req.files.file;

  imageFile.mv(`${__dirname}/downloads/${req.body.filename}.jpg`, function(err: Error) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: `downloads/${req.body.filename}.jpg`});
  });

});

export default router;
