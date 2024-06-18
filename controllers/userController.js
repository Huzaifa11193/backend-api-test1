const User = require("../models/User");
const mail = require('../config/mail')

const list =  async(req,res) =>{
   const users = await User.find();
   res.status(200).json({users:users});
}


const create = async (req,res) =>{
    const {name,email,password} = req.body;
    try{
        const doc = new User();
        doc.name = name;
        doc.email = email;
        doc.password = password;
        await doc.save();

        mail(
            {
                subject:"New User",
                text:"User Created Successfully",
                html:`<ul>
                    <li>Name : ${name}</li>
                    <li>Email : ${email}</li>
                </ul>`,
                to: 'huzaifa@aptechnorth.edu.pk'
            }
        )

        res.status(200).json({message:"Saved Succussfully"});
    }catch(err){
        res.status(400).json({message:err.message })
    }

}

const update = async(req,res) =>{
    const id = req.params.id;
    const {name,email,password} = req.body;
    try{
        const doc = await User.findByIdAndUpdate(id,{
            name:name,email:email,password:password
        })
        res.status(200).json({message:"Updated Succussfully"});
    }
    catch(err){
        res.status(400).json({message:err.message })
    }
}

const delete_ =  async (req,res) =>{
    const id = req.params.id;
    try{
        await User.findByIdAndDelete(id);
        res.status(200).json({message:"Deleted Succussfully"});
    }
    catch(err){
        res.status(400).json({message:err.message })
    }
}

const detail = async (req,res) => {
    const id = req.params.id;
    try{
        const user = await User.findOne({_id:id})
        res.status(200).json({user:user});
    }
    catch(err){
        res.status(400).json({message:err.message })
    }
}


module.exports = {
    list,create,delete_,update,detail
}