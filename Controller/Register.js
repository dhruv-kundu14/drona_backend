const { getDb } = require('../Config/mongo.js');

const Register = async(req,res) =>{
    try{
        const dronaRegister = req?.body;

        const result = await getDb().collection('dronaRegister').insertOne(dronaRegister);
        res.status(201).json({ message: "Register data inserted successfully", result});
        console.log("Register data");
    }
    catch(error){
        console.error("error saving data",error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {Register};