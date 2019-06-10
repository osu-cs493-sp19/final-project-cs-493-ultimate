/* 
 * API sub-router for courses endpoints
 */

const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validate');
const { getCoursesPage, 
        CourseSchema,
        insertNewCourse,
        getCourseById,
        updateCourseById,
        deleteCourseById,
        getStudentsByCourseId,
        getAssignmentsByCourseId } = require('../model/course');

const { validateJwt,
        getRole } = require('../lib/auth');


router.get('/', async (req, res) => {
    try {
        const coursePage = await getCoursesPage(parseInt(req.query.page) || 1);
        coursePage.links = {};
        if (coursePage.page < coursePage.totalPages) {
            coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
            coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
        }
        if (coursePage.page > 1) {
            coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
            coursePage.links.firstPage = '/courses?page=1';
        }
        res.status(200).send(coursePage);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: "Error fetching courses.  Please try again later."
        });
    }
});

router.post('/', validateJwt, getRole, async (req, res) => {

    if(req.role === 'admin'){
        if(validateAgainstSchema(req.body, CourseSchema)){
            try {
                const id = await insertNewCourse(req.body);
                res.status(201).send({
                    id: id
                });
            } catch (error) {
                console.error(error);
                res.status(500).send({
                    error: "Error inserting new course into DB. Try again later."
                });
            }
        } else {
            res.status(400).send({
                error: "Request body is not a valid course object."
            });
        }
    } else {
        next();
    }
});

//no need for auth
router.get('/:id', async (req, res, next) => {
    try {
        const course = await getCourseById(parseInt(req.params.id));
        if(course){
            res.status(200).send(course);
        } else{
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: "Unable to fetch course. Try again later."
        });
    }
});

router.patch('/:id', validateJwt, getRole, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const course = await getCourseById(id);
        if(course.instructorId === req.user || req.role === 'admin'){
            const updateSuccess = await updateCourseById(id, req.body);
            if(updateSuccess){
                res.status(200).send();
            } else{
                res.status(500).send({
                    error: "Unable to update course."
                });
            }
        } else {
            res.status(500).send({
                error: "Unauthorized." 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
                error: "Unable to update course. Try again later."
        });
    }
});

router.delete('/:id', validateJwt, getRole, async (req, res, next) => {
    if(req.role === 'admin'){
        try {
            const deleteSuccess = await deleteCourseById(parseInt(req.params.id));
            if(deleteSuccess){
                res.status(204).end();
            } else{
                next();
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                error: "Unable to delete course. Please try later."
            });
        }
    } else {
        res.status(403).send({
            error: "Unauthorized"
        });
    }
});

router.get('/:id/students', validateJwt, getRole, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const course = await getCourseById(id);
        if(course.instructorId === req.user || req.role === 'admin'){
            const results = await getStudentsByCourseId(id);
            var students = [];
            results.forEach(RowDataPacket => {
                students.push(RowDataPacket.userId);
            });
            res.status(200).send({
                students: students
            });
        } else{
            res.status(403).send({
                error: "Unauthorized"
            });
        }
    } catch (error) {
        console.error(error);
        next();
    }
});

router.get('/:id/assignments', validateJwt, getRole, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const course = await getCourseById(id);
        if(course.instructorId === req.user || req.role === 'admin'){
            const results = await getAssignmentsByCourseId(id);
            var assignments = [];
            results.forEach(RowDataPacket => {
                assignments.push(RowDataPacket.id);
            });
            res.status(200).send({
                assignments: assignments
            });
        } else{
            res.status(403).send({
                error: "Unauthorized"
            });
        }
    } catch (error) {
        console.error(error);
        next();
    }
});

module.exports = router;