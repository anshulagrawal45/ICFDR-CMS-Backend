const { authenticateToken } = require("../Authorization/AuthenticateToken");



exports.NoAuthRoute = (app, endPoint, model) => {
    const getData = async (req, res) => {
        // const ry = req.query;
        // try {
        //     const data = await model.find(query);
        //     res.send(data);
        // } catch (err) {
        //     res.send("Internal Server Error");
        // }
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
        const skip = (page - 1) * limit;
        console.log("normal get")
        try {
            // const dataQuery = await model.find();

            // const data =  dataQuery.skip(skip).limit(limit);
            // console.log(dataQuery)
            // res.send({ data, count:dataQuery.length });

            const { page, limit } = req.query;
            let temp = await model.find()
            let skip = (page - 1) * limit
            let data = await model.find().skip(skip).limit(limit)
            res.send({ data, count: temp.length })
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }
    }
    // const getData = async (req, res) => {
    //     const query = req.query;
    //     try {
    //         const data = await model.find(query);
    //         res.send(data);
    //     } catch (err) {
    //         res.send("Internal Server Error");
    //     }
    // }

    const getDataById = async (req, res) => {
        const id = req.params.id;
        try {
            console.log("get data by id")
            const data = await model.findById(id);
            if (!data) {
                res.status(404).send("Object not found");
            } else {
                res.send(data);
            }
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }
    }

    const addData = async (req, res) => {
        const data = req.body;
        try {
            if (model.modelName == "member") {
                let prev = await model.findOne({ email: data.email });
                if (prev) return res.send({ error: "Member already exists with same email ID" })
            }
            const member = new model(data);
            await member.save();
            res.send(data);
        } catch (err) {
            // console.log(err)
            res.send(err);
        }
    }
    const updateDataById = async (req, res) => {
        const id = req.params.id;
        try {
            const data = req.body;
            console.log(data)
            const updatedObjet = await model.findOneAndUpdate({ _id: id }, data);
            res.send(`Object with ID:${id} has been Updated`);
        }
        catch (err) {
            res.status(500).send("Internal Server Error");
        }
    }
    const deleteDataById = async (req, res) => {
        const id = req.params.id;
        try {
            const deletedObject = await model.findByIdAndDelete(id);
            if (!deletedObject) {
                res.status(404).send("Object not found");
            } else {
                res.send(`Object with ID:${id} has been deleted`);
            }
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }
    }
    const getDataByQuery = async (req, res) => {
        try {
            const query = {};
        for (const key in req.query) {
            if (key !== 'fields') {
                query[key] = req.query[key];
            }
        }
        console.log("get data by query")
            const data = await model.find(query);
            // if (!data) {
            //     return res.status(404).send(`Fields ${fields.join(', ')} not found`);
            // }
    
            res.send(data);
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }
    };
    app
        .get(`/${endPoint}`, getData)
        .get(`/${endPoint}/query`,getDataByQuery)
        .get(`/${endPoint}/:id`, getDataById)
        .post(`/${endPoint}`, addData)
        .patch(`/${endPoint}/:id`, updateDataById)
        .delete(`/${endPoint}/:id`, deleteDataById)
}