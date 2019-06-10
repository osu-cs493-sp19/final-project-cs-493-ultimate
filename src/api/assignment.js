/* To Do:
 * Change User Tokens
 * Re-enable data verification
 * Logged in student's submission needs to work without parameter 
 * Existence checking for each command !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * 
 * Required SQL Containers:
 * --Assignments
 * --Submissions
 * 
 * POST Bodies:
 * --Assignment
{
  "courseId": "5",
  "title": "HW2",
  "description": "Complete this equation.",
  "points": "200",
  "due": "uhh"
}
 * --Submission:
{
  "studentId": "3",
  "description": "I did it.",
  "timestamp": "3000-2",
  "file": "something.jpg"
}
 * 
 * Checklist:
 * Post Assignment[x] --> Need to add admin or instructor authentication , fix user authentication
 * Get Assignment[x]
 * Patch Assignment[x] --> Need to add admin or instructor authentication
 * Delete Assignment[x] --> Need to add admin or instructor authentication
 * Get Submission [x] --> Anyone can view, no authentication required
 * Post Submission [x] --> Anyone who is logged in can post, fix user authentication
 * */
/*
 * API sub-router for assignments/submissions collection endpoints.
 */

const router = require('express').Router();
var jwt = require('jsonwebtoken');

const { validateAgainstSchema } = require('../lib/validate');
const {
  assignmentSchema,
  submissionSchema,
  getAssignmentsPage,
  getSubmissionsPage,
  insertNewAssignment,
  insertNewSubmission,
  getAssignmentById,
  replaceAssignmentById,
  deleteAssignmentById
} = require('../model/assignment');

const { validateAuth,
  authenticate,
  generateJwt,
  validateJwt,
  getRole } = require('../lib/auth');

/*
 * Route to fetch assignments.
 */
router.get('/', async (req, res, next) => {
  try {
    const assignmentPage = await getAssignmentsPage(parseInt(req.query.page) || 1);
    assignmentPage.links = {};
    if (assignmentPage.page < assignmentPage.totalPages) {
      assignmentPage.links.nextPage = `'/assignments?page=${assignmentPage.page + 1}`;
      assignmentPage.links.lastPage = `'/assignments?page=${assignmentPage.totalPages}`;
    }
    if (assignmentPage.page > 1) {
      assignmentPage.links.prevPage = `/assignments?page=${assignmentPage.page - 1}`;
      assignmentPage.links.firstPage = `/assignments?page=1`;
    }
    res.status(200).send(assignmentPage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching assignments list.  Please try again later."
    });
  }
});

/*
 * Route to return a specific of assignments.
 */
router.get('/:id', async (req, res) => {
  try {
    const assignment = await getAssignmentById(parseInt(req.params.id));
    if (assignment) {
      res.status(200).send(assignment);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch assignment.  Please try again later."
    });
  }
});


/*
 * Route to fetch submissions of a particular assignment.
 */
router.get('/:id/submissions', async (req, res, next) => { //!!!!!!!!!!!!!!!!!!!add error check for id existence
  try {
    const submissionPage = await getSubmissionsPage(parseInt(req.query.page) || 1, req.params.id);
    submissionPage.links = {};
    if (submissionPage.page < submissionPage.totalPages) {
      submissionPage.links.nextPage = `'/${req.params.id}/submissions?page=${submissionPage.page + 1}`;
      submissionPage.links.lastPage = `'/${req.params.id}/submissions?page=${submissionPage.totalPages}`;
    }
    if (submissionPage.page > 1) {
      submissionPage.links.prevPage = `/${req.params.id}/submissions?page=${submissionPage.page - 1}`;
      submissionPage.links.firstPage = `/${req.params.id}/submissions?page=1`;
    }
    res.status(200).send(submissionPage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching submissions list.  Please try again later."
    });
  }
});


/*
* User Authentication for following functions
*//*
const privatekey = 'mykey';
function authUser(req, res, next) {
  if (req.token !== null) { // Existing token
      let payload = loggedIn(req.token);

      if (payload !== null) { // && payload.exp > new Date().getTime()) {
          req.tokenPayload = payload;
          next();
      } else {
          res.status(401).send("You are not logged in!");
      }
  } else {
      res.status(403).send("No token provided");
  }
}
function loggedIn(token) {
  let payload = null;
  try {
      payload = jwt.verify(token, privatekey);
  } catch (err) {
      return null;
  }
  return payload;
}
router.use(authUser);*/

/*
 * Route to create a new assignment.
 */
router.post('/', async (req, res) => {
  if (validateAgainstSchema(req.body, assignmentSchema)) {
    try {
      //if (req.tokenPayload.id == req.body.role){ //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CHANGE
      const id = await insertNewAssignment(req.body);
      res.status(201).send({
        id: id,
        courseId: req.body.courseId,
        links: {
          assignment: `/assignments/${id}`,
          submission: `/assignments/${id}/submissions`
        }
      });
    } //else res.status(401).json({ error: "You are not authorized to add this resource." });} 
     catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting assignment into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid assignment object."
    });
  }
});

/*
 * Route to replace data for a assignment.
 */
router.patch('/:id', async (req, res, next) => {
  if (validateAgainstSchema(req.body, assignmentSchema)) {
    try {
      //if (req.tokenPayload.id ==  (await getAssignmentById(req.params.id)).studentId || req.tokenPayload.role == 2){ //need to change later
      const id = parseInt(req.params.id)
      const updateSuccessful = await replaceAssignmentById(req.params.id, req.body);
      if (updateSuccessful) {
        res.status(200).send({
          links: {
            assignment: `/assignments/${id}`,
            submission: `/assignments/${id}/submissions`
          }
        });
      } else {
        next();
      }
    } //else {res.status(401).json({ error: "You are not authorized to change this resource." });}} 
    catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to update specified assignment.  Please try again later."
      });
    }
  
  }
   else {
    res.status(400).send({
      error: "Request body is not a valid assignment object"
    });
  }
});

/*
 * Route to delete a assignment.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    //if (req.tokenPayload.id ==  (await getAssignmentById(req.params.id)).studentId || req.tokenPayload.role == 1){ //need to change later
    const deleteSuccessful = await deleteAssignmentById(parseInt(req.params.id));
    if (deleteSuccessful) {
      console.log("deleted");
      res.status(200).send(`Deleted ${req.params.id}.`);
    } else {
      next();
    }
  } //else {res.status(401).json({ error: "You are not authorized to delete this resource." });}} 
  catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete assignment.  Please try again later."
    });
  }
});

/*
 * Route to create a new submission.
 */
router.post('/:id/submissions', async (req, res) => {
  if (validateAgainstSchema(req.body, submissionSchema)) {
    try {
      //if (req.tokenPayload.id == req.body.role){ //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CHANGE
      const id = await insertNewSubmission(req.body, req.params.id);
      res.status(201).send({
        id: id,
        assignmentId: req.body.assignmentId, //FIXXXXXXXXXXXXXXXXXXXXXx
        studentId: req.body.studentId,//req.tokenPayload.id, //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CHANGE
        links: {
          submissions: `/assignments/${id}/submissions`
        }
      });
    } //else res.status(401).json({ error: "You are not authorized to add this resource." });} 
     catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting submission into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid submission object."
    });
  }
});

module.exports = router;
