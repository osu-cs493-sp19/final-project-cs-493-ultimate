const router = require('express').Router();
const fs = require('fs');

const { getSubmissionbyID } = require('../model/assignment');
const {
  validateJwt,
  getRole } = require('../lib/auth');

router.get('/:id.pdf', validateJwt, getRole, async (req, res, next) => {
  try{
    if(req.role === "admin" || req.role === "instructor" || req.role === "student" ){
      const submission = await getSubmissionbyID(parseInt(req.params.id));
      if(submission){
        res.status(200).type('application/pdf').send(submission.fileData);
       }
     }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Unable to fetch submission. Try again later."
    });
  }
});

module.exports = router;
