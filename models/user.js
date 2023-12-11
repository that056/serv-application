const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
Email:{
    type : String,
    required :true
},
Password :{
    type :String,
    required:true
},
UserName :{
type : String,
required:true
}
})

const User = mongoose.model('user',UserSchema);
module.exports =User;