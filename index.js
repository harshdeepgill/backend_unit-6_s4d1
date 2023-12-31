const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./Router/user.router");
const { auth } = require("./middleware/auth");
const { TodoModel } = require("./Model/todo.model");
require("dotenv").config();
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const PORT = process.env.PORT || 3000

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User Management System",
            version: "1.0.0"
        },
        servers: [
            {
                url: "https://lucky-kilt-fox.cyclic.app"
            }
        ]
    },
    apis: ["./Router/*.js"]
}



const app = express();

// tis specificaten used to build UI
const swaggerSpec = swaggerJsDoc(options);
//building the UI by using swaggerSpec for UI setup
app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(cors());

app.use(express.json());

/**
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  description: Auto genrated id of the user
 *              username:
 *                  type: string
 *                  description: Username of the user
 *              email:
 *                  type: string
 *                  description: Email of the user
 *              password:
 *                  type: string
 *                  description: Hashed password by bcrypt
 *      Todo:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  description: Auto genrated id of the todo
 *              title:
 *                  type: string
 *                  description: Title of the todo
 *              status:
 *                  type: boolean
 *                  description: Status of complition of the todo
 *              userId:
 *                  type: string
 *                  description: Id of the user who created the todo
 */



app.use("/user", userRouter);

// Restricted routes

/**
 * /:
 *  get:
 *      summary: Get all the todos asociated with perticular user
 *      responses:
 *          200:
 *              description: List of all the todos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/Todo"
 * 
 */

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
            await TodoModel.findByIdAndUpdate({_id: id}, req.body);
            res.status(200).send({"msg": `Todo with id ${id} is updated.`});
        }else{
            res.status(400).send({"msg": "You are not authorized to update this todo."});
        }
    } catch (err) {
        res.send({"msg": err})
    }
})

app.delete("/deletetodo/:id",auth, async (req, res) => {
    const id = req.params.id;
    try {
        const targetTodo = await TodoModel.findOne({_id:id});
        if(targetTodo.userId === req.body.userId){
            await TodoModel.findByIdAndDelete({_id: id});
            res.status(200).send({"msg": `Todo with id ${id} is deleted.`});
        }else{
            res.status(400).send({"msg": "You are not authorized to delete this todo."});
        }
    } catch (err) {
        res.send({"msg": err})
    }
})



app.listen(PORT,async ()=>{
    try {
        await connection;
        console.log("DB connected!");
        console.log("Server is running!");
    } catch (err) {
        console.log(err);
    }
})