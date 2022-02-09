module.exports = (req, res, next) => {
    res.__sendJson = (data = {}) => {
        res.json({
            status: 'success',
            data
        });
    };

    res.__sendSuccess = (data = {})=>{
        res.json({
            status: 'success',
            data
        });
    };
    
    res.__sendFail = (statusCode, data = {}) => {
        res.status(statusCode).json({
            status: 'error', data
        });
    };

    res.__sendValidationError = (data = {}) => {
        res.status(400).json({
            status: 'error',
            data
        });
    };

    res.__sendInternalServerError = (data) => {
        res.status(500).json({
            status: 'error',
            data
        });
    };
    next();
};