const clientError = require('../error/clientError');

const validate = (schema,input) => {
    const {error,value} = schema.validate(input);
    if(error) throw new clientError(error.message);
    return value;
}

module.exports = validate;