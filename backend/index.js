import express from "express";
import { PORT,mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModels.js";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors())

app.get("/", (req, res) => {
    console.log(req)
    return res.status(234).send("Hello World");
})

app.post("/books", async (req, res) => {
    try{
        if(
            !req.body.title || !req.body.author || !req.body.publishYear
        ){
            return res.status(400).send({message:'Send all required fields:title,author,publishYear'})
        }

        const newBook = new Book({
            title:req.body.title,
            author:req.body.author,
            publishYear:req.body.publishYear
        })

        const book = await Book.create(newBook)
        return res.status(201).send(book)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

//Route for get all books frm database
app.get('/books',async(req,res)=>{
    try{
        const books = await Book.find({})
        return res.status(200).json({
            count:books.length,
            data:books
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}
)

app.get('/books/:id',async(req,res)=>{
    try{

        const { id } = req.params

        const book = await Book.findById(id)
        return res.status(200).json(book)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}
)

//Route for update
app.put('/books/:id',async(req,res)=>{
    try{
        if(!req.body.title || !req.body.author || !req.body.publishYear)
        {
            return res.status(400).send({message:'Send all required fields:title,author,publishYear'})
        }

        const { id } = req.params
        const result = await Book.findByIdAndUpdate(id,req.body)

        if(!result){
            return res.status(404).json({message:'Book not found'})
        }
        return res.status(200).send({message : 'Book updated'})
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

//Route for delete

app.delete('/books/:id',async(req,res)=>{
    try{
        const { id } = req.params
        const result = await Book.findByIdAndDelete(id)

        if(!result){
            return res.status(404).json({message:'Book not found'})
        }
        return res.status(200).send({message : 'Book deleted'})
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("MongoDB connected")
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        });
    })
    .catch((err) => {
        console.log(err)
    })