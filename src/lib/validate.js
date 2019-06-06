exports.validateAgainstSchema = function (obj, schema) {
    return obj && Object.keys(schema).every(
        field => (!schema[field].required || obj[field]) && (!obj[field] || (typeof obj[field]) === schema[field].type)
    );
};