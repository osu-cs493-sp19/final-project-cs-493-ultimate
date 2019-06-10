/*
 * Assignment schema and data accessor methods;
 */

const dbPool = require('../lib/database');
const { extractValidFields } = require('../lib/validate');


/*
 * Schema describing required/optional fields of a assignment object.
 */
const assignmentSchema = {
  courseId: { required: false, type: 'number' }, //float checking made
  title: { required: true, type: 'string' },
  description: { required: false, type: 'string' },
  points: {required: true, type: 'number' }, //same here as well
  due: {required: false, type: 'string' }
};
exports.assignmentSchema = assignmentSchema;

/*
 * Schema describing required/optional fields of a submission object. Submission object has its own id for URL download reasons
 */
const submissionSchema = {
  description: { required: false, type: 'string' },
  timestamp: { required: true, type: 'string' },
  file: { required: true, type: 'string' } 
};
exports.submissionSchema = submissionSchema;

/*
 * Executes a MySQL query to fetch the total number of assignments.  Returns
 * a Promise that resolves to this count.
 */
function getAssignmentsCount() {
  return new Promise((resolve, reject) => {
    dbPool.query(
      'SELECT COUNT(*) AS count FROM assignments',
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count);
        }
      }
    );
  });
}
exports.getAssignmentsCount = getAssignmentsCount;

/*
 * Executes a MySQL query to return a single page of assignments.  Returns a
 * Promise that resolves to an array containing the fetched page of assignments.
 */
function getAssignmentsPage(page) {
  return new Promise(async (resolve, reject) => {
    /*
     * Compute last page number and make sure page is within allowed bounds.
     * Compute offset into collection.
     */
     const count = await getAssignmentsCount();
     const pageSize = 10;
     const lastPage = Math.ceil(count / pageSize);
     page = page > lastPage ? lastPage : page;
     page = page < 1 ? 1 : page;
     const offset = (page - 1) * pageSize;

     dbPool.query(
      'SELECT * FROM assignments ORDER BY id LIMIT ?,?',
      [ offset, pageSize ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            assignments: results,
            page: page,
            totalPages: lastPage,
            pageSize: pageSize,
            count: count
          });
        }
      }
    );
  });
}
exports.getAssignmentsPage = getAssignmentsPage;

/*
 * Executes a MySQL query to fetch the total number of submissions.  Returns
 * a Promise that resolves to this count.
 */
function getSubmissionsCount(id) {
  return new Promise((resolve, reject) => {
    dbPool.query(
      'SELECT COUNT(*) AS count FROM submissions WHERE assignmentId = ?',
      [id],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count);
        }
      }
    );
  });
}
exports.getSubmissionsCount = getSubmissionsCount;

/*
 * Executes a MySQL query to return a single page of assignments.  Returns a
 * Promise that resolves to an array containing the fetched page of assignments.
 */
function getSubmissionsPage(page, id) {
  return new Promise(async (resolve, reject) => {
    /*
     * Compute last page number and make sure page is within allowed bounds.
     * Compute offset into collection.
     */
     const count = await getSubmissionsCount(id);
     const pageSize = 10;
     const lastPage = Math.ceil(count / pageSize);
     page = page > lastPage ? lastPage : page;
     page = page < 1 ? 1 : page;
     const offset = (page - 1) * pageSize;

    dbPool.query(
      'SELECT * FROM submissions WHERE assignmentId = ? ORDER BY assignmentId LIMIT ?,?',
      [ id, offset, pageSize ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            submissions: results,
            page: page,
            totalPages: lastPage,
            pageSize: pageSize,
            count: count
          });
        }
      }
    );
  });
}
exports.getSubmissionsPage = getSubmissionsPage;


/*
 * Executes a MySQL query to insert a new assignment into the database.  Returns
 * a Promise that resolves to the ID of the newly-created assignment entry.
 */
function insertNewAssignment(assignment) {
  return new Promise((resolve, reject) => {
    assignment = extractValidFields(assignment, assignmentSchema);
    assignment.courseId = parseInt(assignment.courseId); //safety check
    assignment.points = parseInt(assignment.points); //safety check
    assignment.id = null;
    dbPool.query(
      'INSERT INTO assignments SET ?',
      assignment,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
}
exports.insertNewAssignment = insertNewAssignment;


/*
 * Executes a MySQL query to insert a new submission into the database.  Returns
 * a Promise that resolves to the ID of the newly-created assignment entry.
 */
function insertNewSubmission(submission,id,sId) {
  return new Promise((resolve, reject) => {
    submission = extractValidFields(submission, submissionSchema);
    submission.id = null;
    submission.assignmentId = id;
    submission.studentId = sId;
    dbPool.query(
      'INSERT INTO submissions SET ?',  
      submission,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
}
exports.insertNewSubmission = insertNewSubmission;

/*
 * Executes a MySQL query to fetch information about a single specified
 * assignment based on its ID. Returns a Promise that resolves to an object containing
 * information about the requested assignment.  If no assignment with the
 * specified ID exists, the returned Promise will resolve to null.
 */
function getAssignmentById(id) {
  return new Promise((resolve, reject) => {
    dbPool.query(
      'SELECT * FROM assignments WHERE id = ?',
      [ id ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}
exports.getAssignmentById = getAssignmentById;

/*
 * Executes a MySQL query to replace a specified assignment with new data.
 * Returns a Promise that resolves to true if the assignment specified by
 * `id` existed and was successfully updated or to false otherwise.
 */
function replaceAssignmentById(id, assignment) {
  return new Promise((resolve, reject) => {
    assignment = extractValidFields(assignment, assignmentSchema);
    dbPool.query(
      'UPDATE assignments SET ? WHERE id = ?',
      [ assignment, id ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
}
exports.replaceAssignmentById = replaceAssignmentById;

/*
 * Executes a MySQL query to delete a assignment specified by its ID along with it's submissions.  
 * Returns a Promise that resolves to true if the assignment specified by `id` existed
 * and was successfully deleted or to false otherwise.
 */
function deleteAssignmentById(id) {
  return new Promise((resolve, reject) => {
    dbPool.query(
      'DELETE FROM assignments WHERE id = ?', //delete this assignment
      [ id ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
    dbPool.query(
      'DELETE FROM submissions WHERE assignmentId = ?', //delete this assignment's submissions
      [ id ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
}
exports.deleteAssignmentById = deleteAssignmentById;
