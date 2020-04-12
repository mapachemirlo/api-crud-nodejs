const jwt = require('jsonwebtoken');

// Valdo por hostname
const isValidHostname = (req, res, next) => {
    console.log('req.headers', req.headers);
    const validHost = ['pepe.com', 'localhost'];
    if(validHost.includes(req.hostname)){
        next();
    }else{
        res.status(403).send({ status: 'ACCESS_DENIED'});
    }
};

// Valído por token y el admin puede modificar todo
// const isAuth = (req, res, next) => {
//     try {
//         const { token } = req.headers;
//         if(token){
//             const data = jwt.verify(token, process.env.JWT_SECRET);
//             console.log('jwt data', data);
//             if(data.userId !== req.body.userId && data.role !== 'admin'){
//                 throw {
//                     code: 403,
//                     status: 'ACCESS_DENIED',
//                     message: 'Missing permission or invalid token'
//                 }
//             }
//             next();
//         }else{
//             throw {
//                 code: 403,
//                 status: 'ACCESS_DENIED',
//                 message: 'Missing header token'
//             }
//         }
//     } catch (e) {
//         res.status(e.code || 500).send({ status: 'ACCESS_DENIED', message: 'Missing header token' });
//     }
// };

// Valído por token y solamente cada usuario podrá actualizar sus propios datos
const isAuth = (req, res, next) => {
    try {
        const { token } = req.headers;
        if(token){
            const data = jwt.verify(token, process.env.JWT_SECRET);
            console.log('jwt data', data);
            req.sessionData = { userId: data.userId, role: data.role }; //Escribo directamente en el request lo que me traigo del to
            next();
        }else{
            throw {
                code: 403,
                status: 'ACCESS_DENIED',
                message: 'Missing header token'
            }
        }
    } catch (e) {
        res.status(e.code || 500).send({ status: 'ACCESS_DENIED', message: 'Missing header token' });
    }
};

// Valído solo por admin
const isAdmin = (req, res, next) => {
    try {
        const { role } = req.sessionData;
        console.log('Role: ', role);
        if(role !== 'admin'){
            throw {
                code: 403,
                status: 'ACCESS_DENIED',
                message: 'Invalid role'
            };
        }else{
            next();
        }
    } catch (e) {
        res.status(e.code || 500).send({ status: e.status || 'ERROR', message: e.message });
    }
};


module.exports = { isValidHostname, isAuth, isAdmin };