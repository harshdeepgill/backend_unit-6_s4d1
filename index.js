const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./Router/user.router");
const { auth } = require("./middleware/auth");
const { TodoModel } = require("./Model/todo.model");

const app = express();

app.use(express.json());

app.use("/user", userRouter);

// Restricted routes

app.get("/",auth, async (req, res) => {
    try {
        const todos = await TodoModel.find({userId: req.body.userId});
        res.status(200).send({"todos": todos});
    } catch (err) {
        res.send({"msg": err});
    }
})

app.post("/addtodo",auth, async (req, res) => {
    try {
        console.log(req.body);
        const todo = new TodoModel(req.body);
        await todo.save();
        res.status(200).send({"msg": "New Todo Added!", "New Todo": todo})
    } catch (err) {
        res.send({"msg": err});
    }
})

app.patch("/updatetodo/:id",auth, async (req, res) => {
    const id = req.params.id;
    try {
        const targetTodo = await TodoModel.findOne({_id:id});
        if(targetTodo.userId === req.body.userId){
            await TodoModel.findByIdAndUpdate({id}, req.body);
            res.status(200).send({"msg": `Todo with id ${id} is updated.`});
        }else{
            res.status(400).send({"msg": "You are not authorized to update this todo."});
        }
    } catch (err) {
        res.send({"msg": err})
    }
})

app.delete("/deletetodo",auth, async (req, res) => {
    const id = req.params.id;
    try {
        const targetTodo = await TodoModel.findOne({_id:id});
        if(targetTodo.userId === req.body.userId){
            await TodoModel.findByIdAndDelete({id});
            res.status(200).send({"msg": `Todo with id ${id} is deleted.`});
        }else{
            res.status(400).send({"msg": "You are not authorized to delete this todo."});
        }
    } catch (err) {
        res.send({"msg": err})
    }
})



app.listen(8080,async ()=>{
    try {
        await connection;
        console.log("DB connected!");
        console.log("Server is running!");
    } catch (err) {
        console.log(err);
    }
})