/* To Do:
 * -Add file URL access
 * -Add Download Support
 * 
 * Required SQL Containers:
 * --Assignments
 * --Submissions
 * 
 * POST Bodies:
 * --Assignment (requires user to be logged in as instructor at minimum)
{
  "courseId": 5,
  "title": "HW2",
  "description": "Complete this equation.",
  "points": 200,
  "due": "Today buddy"
}
 * --Submission (requires user to be logged in as student at minimum): 
{
  "description": "I did it.",
  "timestamp": "3000-2",
  "file": "something.jpg"
}
 * 
 * Checklist:
 * Get Assignments[x] --> Anyone can view all assignments, paginated
 * Get Assignment[x] --> Anyone can view a single assignment
 * Post Assignment[x] --> Need to be admin or instructor
 * Patch Assignment[x] --> Need to be admin or instructor
 * Delete Assignment[x] --> Need to be admin or instructor
 * Get Submission [x] --> Anyone can view all submissions, paginated
 * Post Submission [x] --> Need to be admin, instructor, or student
 */
/*
 * API sub-router for assignments/submissions collection endpoints.
 */

const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validate');
const {
  assignmentSchema,
  submissionSchema,
  getAssignmentsCount,
  getAssignmentsPage,
  getSubmissionsCount,
  getSubmissionsPage,
  insertNewAssignment,
  insertNewSubmission,
  getAssignmentById,
  replaceAssignmentById,
  deleteAssignmentById
} = require('../model/assignment');

const {
  validateJwt,
  getRole } = require('../lib/auth');

/*
 * Route to fetch assignments.
 */
router.get('/', async (req, res, next) => {
  try {
    if ((await getAssignmentsCount()) != 0){ //make sure the number of assignments is greater than 0
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
  } else {
    res.status(404).send({
      error: "No assignments found."
    });
  }
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
        res.status(404).send({
        error: `No assignment of id: ${req.params.id} found.`
      });
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
router.get('/:id/submissions', async (req, res, next) => {
  try {
    if(await getAssignmentById(parseInt(req.params.id))){
      if ((await getSubmissionsCount(req.params.id)) != 0){ //make sure the number of submissions is greater than 0
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
      } else {
        res.status(404).send({
        error: `No submissions for assignment of id: ${req.params.id} found.`
        });
      }
    } else {
      res.status(404).send({
        error: `No assignment of id: ${req.params.id} found.`
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching submissions list.  Please try again later."
    });
  }
});


/*
* %%%%%%%% User Authentication required for functions past this point. %%%%%%%%
*/

/*
 * Route to create a new assignment. User must be admin or instructor.
 */
router.post('/', validateJwt, getRole, async (req, res) => {
  if (validateAgainstSchema(req.body, assignmentSchema)) {
    try { 
      if ( req.role === "admin" || req.role === "instructor" ){ 
      const id = await insertNewAssignment(req.body);
      res.status(201).send({
        id: id,
        courseId: parseInt(req.body.courseId),
        links: {
          assignment: `/assignments/${id}`,
          submission: `/assignments/${id}/submissions`
        }
      });
    } else res.status(401).json({ error: "You are not authorized to add this resource."});} 
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
 * Route to replace data for a assignment. User must be admin or instructor.
 */
router.patch('/:id', validateJwt, getRole, async (req, res, next) => {
  if (validateAgainstSchema(req.body, assignmentSchema)) {
    try {
      if ( req.role === "admin" || req.role === "instructor" ){ 
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
    } else {res.status(401).json({ error: "You are not authorized to change this resource." });}} 
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
 * Route to delete a assignment. User must be admin or instructor.
 */
router.delete('/:id', validateJwt, getRole, async (req, res, next) => {
  try {
    if ( req.role === "admin" || req.role === "instructor" ){ 
    const deleteSuccessful = await deleteAssignmentById(parseInt(req.params.id));
    if (deleteSuccessful) {
      console.log("deleted");
      res.status(200).send(`Deleted assignments/${req.params.id}. Submissions to this assignment are also deleted.`);
    } else {
      next();
    }
  } else {res.status(401).json({ error: "You are not authorized to delete this resource." });}} 
  catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete assignment.  Please try again later."
    });
  }
});

/*
 * Route to create a new submission. User must be admin, instructor, or student.
 */
router.post('/:id/submissions', validateJwt, getRole, async (req, res) => { 
  if (validateAgainstSchema(req.body, submissionSchema)) {
    try {
      if ( req.role === "admin" || req.role === "instructor" || req.role === "student" ){ 
      if(await getAssignmentById(parseInt(req.params.id))){
        const id = await insertNewSubmission(req.body, req.params.id, req.user);
        res.status(201).send({
          id: id,
          assignmentId: req.params.id,
          studentId: req.user, 
          links: {
            submissions: `/assignments/${req.params.id}/submissions`
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Need a URL for file access!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          }
        });
      }
      else {
        res.status(404).send({
          error: `No assignment of id: ${req.params.id} found.`
        });
      }
    } else res.status(401).json({ error: "You are not authorized to add this resource." });} 
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
