/* 
 * API sub-router for courses endpoints
 */

const router = require('express').Router();
const {Parser} = require('json2csv');

const { validateAgainstSchema } = require('../lib/validate');
const { getCoursesPage, 
        CourseSchema,
        patchCourseSchema,
        RosterSchema,
        insertNewCourse,
        getCourseById,
        updateCourseById,
        deleteCourseById,
        getStudentsByCourseId,
        getAssignmentsByCourseId,
        insertStudentsInCourse,
        removeStudentsInCourse,
        getCourseRoster } = require('../model/course');

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
                next();
            }
        } else {
            res.status(400).send({
                error: "Request body is not a valid course object."
            });
        }
    } else {
        res.status(403).send({
            error: "Unauthorized"
        });
    }
});


//no need for auth
router.get('/:id', async (req, res, next) => {
    try {
        const course = await getCourseById(parseInt(req.params.id));
        res.status(200).send(course);

    } catch (error) {
        console.error(error);
        next();
    }
});


router.patch('/:id', validateJwt, getRole, async (req, res, next) => {
    try {
        if(validateAgainstSchema(req.body, patchCourseSchema)){
            const id = parseInt(req.params.id);
            const course = await getCourseById(id);
            if(course.instructorId === req.user || req.role === 'admin'){
                const update = await updateCourseById(id, req.body);
                res.status(200).send();
            } else {
                res.status(403).send({
                    error: "Unauthorized." 
                });
            }
        } else{
            res.status(400).send({
                error: "Please"
            })
        }
    } catch (error) {
        console.error(error);
        next();
    }
});


router.delete('/:id', validateJwt, getRole, async (req, res, next) => {
    if(req.role === 'admin'){
        try {
            const deleteSuccess = await deleteCourseById(parseInt(req.params.id));
            res.status(204).end();
        } catch (error) {
            console.error(error);
            next();

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


router.post('/:id/students', validateJwt, getRole, async (req, res, next) => {
    try {
        if(validateAgainstSchema(req.body, RosterSchema)){
            const id = parseInt(req.params.id);
            const course = await getCourseById(id);
            if(course.instructorId === req.user || req.role === 'admin'){
                const removes = [];
                const adds = [];
                req.body.add.forEach(id => {
                    adds.push(id);
                });
                req.body.remove.forEach(id => {
                    removes.push(id);
                });
                if(adds.length > 0){
                    const addResults = await insertStudentsInCourse(id, adds);
                }
                if(removes.length > 0){
                    const rmvResults = await removeStudentsInCourse(id, removes);
                }
                res.status(200).send();
            } else{
                res.status(403).send({
                    error: "Unauthorized"
                });
            }
        } else{
            res.status(400).send({
                error: "Request body is not proper for this method."
            });
        }
    } catch (error) {
        console.error(error);
        next();
    }
});


router.get('/:id/roster', validateJwt, getRole, async (req, res, next) => {
    try {
        const fields = [{
            label: 'ID',
            value: 'id'
        }, {
            label: 'Name',
            value: 'name'
        }, {
            label: 'Email',
            value: 'email'
        }];

        const id = parseInt(req.params.id);
        const course = await getCourseById(id);
        if(course.instructorId === req.user || req.role === 'admin'){
            const results = await getCourseRoster(id);
            const json2csvParser = new Parser({fields});
            const csv = json2csvParser.parse(results);

            res.setHeader('Content-disposition', `attachment; course${id}roster`);
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);
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



router.get('/:id/assignments', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const results = await getAssignmentsByCourseId(id);
        var assignments = [];
        results.forEach(RowDataPacket => {
            assignments.push(RowDataPacket.id);
        });
        res.status(200).send({
            assignments: assignments
        });
    } catch (error) {
        console.error(error);
        next();
    }
});

module.exports = router;