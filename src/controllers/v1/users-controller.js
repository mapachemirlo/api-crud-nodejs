const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../../mongo/models/users');
const Products = require('../../mongo/models/products');

const expiresIn = 60 * 30;
// Los console.log son solo para ir chequeando algunas cosas

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if(user){
            const isOK = await bcrypt.compare(password, user.password);
            if(isOK){
                const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn });
                res.send({ status: 'Ok', data: { token, expiresIn }});
            }else{
                res.status(403).send({ status: 'INVALID_PASSWORD', message: '' });
            }
        }else{
            res.status(401).send({ status: 'USER_NOT_FOUND', message: '' });
        }
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const createUsers = async (req, res) => {
    try {
        console.log('req.body', req.body);
        const { username, email, password, data } = req.body;
        const hash =  await bcrypt.hash(password, 15);
        console.log('Password', hash);
        Users.create({
            username,
            email,
            data,
            password: hash
        });
        res.send({ status: 'OK', message: 'user created'});
    } catch (error) {
        if(error.code && error.code === 11000){
            res.status(400).send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
        }
        console.log('Error create user', error);
        res.status(500).send({ status: 'ERROR', message: error.message });
    }
};

const deleteUsers = async (req, res) => {
    try {
        const { userId } = req.body;
        if(!userId){
            res.status(500).send({ status: 'ERROR', message: 'missing param userId' });
        }
        console.log('userId', userId);
        await Users.findByIdAndDelete(userId);
        await Products.deleteMany({ user: userId });
        res.send({ status: 'OK', message: 'user deleted'});
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }

};

const getUsers = async (req, res) => {
    try {
        const users = await Users.find().select({ password: 0, __v: 0, role: 0 });
        res.send({ status: 'Ok', data: users });
    } catch (e) {
        res.status(500).send({ status: 'ERROR', message: e.message });
    }
};

const updateUsers = async (req, res) => {
    try {
        console.log('req.sessionData', req.sessionData.userId); //Me puedo traer directamente el rol y evitar agrear en el req el userId
        const { username, email, data, userId } = req.body;
        await Users.findByIdAndUpdate(req.sessionData.userId, {  //Acá podría usar directamente sessionData para no escribir el userId 
            username,
            email,
            data
        });
        res.send({ status: 'OK', message: 'user updated'});
    } catch (error) {
        if(error.code && error.code === 11000){
            res.status(400).send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
            return;
        }
        res.status(500).send({ status: 'ERROR', message: 'user update' });
    }
};


module.exports = {
    createUsers,
    deleteUsers,
    getUsers,
    updateUsers,
    login
};