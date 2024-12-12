const { getDb } = require('../Config/mongo.js');

const Career = async(req,res) =>{
    try{
        const careerData = req?.body;

        const res = await getDb().collection('careerData').insertOne(careerData);
        res.status(201).json({ message: "career data inserted successfully", res});
        console.log("career data");
    }
    catch(error){
        console.error("error saving data",error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {Career};