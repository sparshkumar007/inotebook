const express=require('express');
const router=express.Router();
const Notes=require('../models/Notes');
const fetchuser=require('../middlewares/fetchuser');
const {body,validationResult}=require('express-validator');

// router 1: Fetch all notes using /api/notes/fetchallnotes : Login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes=await Notes.find({user:req.user.id});
        if(!notes)
        {
            res.status(401).send("No Notes available for this user");
        }
        res.send(notes);
    } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

// router 2: Add note using /api/notes/addnote : Login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid Title').exists(),
    body('description','Enter a valid Note').exists(),
],async(req,res)=>{
    // checking errors occured in validation of entry
    const err=validationResult(req);
    if(!err.isEmpty)
    {
        return res.json(err);
    }
    try {

        const {title,description,tag,date}=req.body;
        
        // adding notes entry in database
        const note=new Notes({
            title,description,tag,date,user:req.user.id
        })

        const savedNote=await note.save();
        // returning the created notes
        return res.send(savedNote);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

// router 3: Update note using /api/notes/updatenote/:id : Login required
// this id is "id of note"
router.put('/updatenote/:id',fetchuser,[
    body('title','Enter a valid Title').exists(),
    body('description','Enter a valid Note').exists(),
],async(req,res)=>{
    const err=validationResult(req);
    if(!err.isEmpty)
    {
        return res.json(err);
    }
    try {
        const {title,description,tag,date}=req.body;

        // creating note with updated data which is provided in body of req
        const newNote={}
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}

        var note=await Notes.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("No note found by specified id");
        }

        // if the id of currently logined user(req.user) and the id of note user want to update does not match then dont allow the user to change it
        // note.user has id in json form
        if(req.user.id!=note.user.toString())
        {
            return res.status(401).send("Not allowed");
        }

        // update the old note
        // {new:true} means that if any parameter wasnt there then it would add it
        note= await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json({note});

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }    
})
// router 4: Delete note using /api/notes/deletenote/:id : Login required
// this id is "id of note"
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try {

        // searching note of specfied id in req paramaters
        var note=await Notes.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("No note found by specified id");
        }

        // if the id of currently logined user(req.user) and the id of note user want to delete does not match then dont allow the user to change it
        // note.user has id in json form
        if(req.user.id!=note.user.toString())
        {
            return res.status(401).send("Not allowed");
        }

        // update the old note
        // {new:true} means that if any parameter wasnt there then it would add it
        note= await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted","Note":note});
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }    
})
module.exports=router;