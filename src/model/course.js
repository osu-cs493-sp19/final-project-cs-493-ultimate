/*
 * Course schema and data accessor methods;
 */

const db = require('../lib/database');
const { extractValidFields } = require('../lib/validate');


const CourseSchema = {
    subject: { type: 'string', required: true },
    number: { type: 'number', required: true },
    title: { type: 'string', required: true },
    term: { type: 'string', required: true },
    instructorId: { type: 'number', required: true}
}
exports.CourseSchema = CourseSchema;

const RosterSchema = {
    add: { type: 'object', required: true},
    remove: { type: 'object', required: true}
}
exports.RosterSchema = RosterSchema;


function getCoursesCount(){
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT COUNT(*) AS count FROM courses',
            (err, results) => {
                if(err){
                    reject(err);
                } else{
                    resolve(results[0].count);
                }
            }
        );
    });
}


function getCoursesPage(page){
    return new Promise(async(resolve, reject) =>{
        const count = await getCoursesCount();
        const pageSize = 10;
        const lastPage = Math.ceil(count / pageSize);
        page = page > lastPage ? lastPage : page;
        page = page < 1 ? 1 : page;
        const offset = (page - 1) * pageSize;

        db.query(
            'SELECT * FROM courses ORDER BY id LIMIT ?,?',
            [ offset, pageSize ],
            (err, results) => {
                if (err){
                    reject(err)
                } else {
                    resolve({
                        courses: results,
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
exports.getCoursesPage = getCoursesPage;

function insertNewCourse(course){
    return new Promise((resolve, reject) => {
        course = extractValidFields(course, CourseSchema);
        db.query(
            'INSERT INTO courses SET ?',
            course,
            (err, result) => {
                if(err){
                    reject(err);
                } else{
                    resolve(result.insertId);
                }
            }
        );
    });
}
exports.insertNewCourse = insertNewCourse;

function getCourseById(id){
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM courses WHERE id = ?',
            id,
            (err, results) => {
                if (err){
                    reject(err);
                } else{
                    resolve(results[0]);
                }
            }
        );
    });
}
exports.getCourseById = getCourseById;

function updateCourseById(id, course){
    return new Promise((resolve, reject) => {
        course = extractValidFields(course, CourseSchema);
        db.query(
            'UPDATE courses SET ? WHERE id = ?',
            [course, id],
            (err, result) => {
            if(err){
                reject(err);
            } else {
                resolve(result.affectedRows > 0);
            }
        });
    });
}
exports.updateCourseById = updateCourseById;

function deleteCourseById(id){
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM courses WHERE id = ?',
            id,
            (err, result) => {
                if(err){
                    reject(err);
                } else{
                    resolve(result.affectedRows == 1);
                }
            }
        );
    });
}
exports.deleteCourseById = deleteCourseById;

function getStudentsByCourseId(id){
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT userId FROM enrollment WHERE courseId = ?',
            id,
            (err, results) => {
                if(err){
                    reject(err);
                } else{
                    resolve(results);
                }
            }
        );
    });
}
exports.getStudentsByCourseId = getStudentsByCourseId;

function getAssignmentsByCourseId(id){
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT id FROM assignments WHERE courseId = ?',
            id,
            (err, results) => {
                if(err){
                    reject(err);
                } else{
                    resolve(results);
                }
            }
        );
    });
}
exports.getAssignmentsByCourseId = getAssignmentsByCourseId;

function insertStudentsInCourse(courseId, userIds){
    return new Promise((resolve, reject) =>{
        const rows = [];
        userIds.forEach(id => {
            rows.push([courseId, id]);
        });
        db.query(
            'INSERT INTO enrollment (courseId, userId) VALUES ?',
            [rows],
            (err, result) => {
                if(err){
                    reject(err);
                } else{
                    resolve(result.affectedRows > 0);
                }
            }
        );
    });
}
exports.insertStudentsInCourse = insertStudentsInCourse;


function removeStudentsInCourse(courseId, userIds){
    return new Promise((resolve, reject) =>{
        const sql1 = 'DELETE FROM enrollment WHERE courseId = ';
        const sql2 = ' AND userId = ';
        const rows = [];
        userIds.forEach(id => {
            var str = sql1+courseId;
            str +=sql2+id;
            rows.push(str)
        })
        const q = rows.join(';');
        db.query( q,
            (err, result) => {
                if(err){
                    reject(err);
                } else{
                    resolve(result.affectedRows > 0);
                }
            }
        );
    });
}
exports.removeStudentsInCourse = removeStudentsInCourse;

function getCourseRoster(courseId){
    return new Promise((resolve, reject) =>{
        db.query(
            'SELECT id, name, email FROM users JOIN enrollment ON enrollment.courseId = ? AND enrollment.userId = users.id',
            courseId,
            (err, results) => {
                if(err){
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        )
    });
}
exports.getCourseRoster = getCourseRoster