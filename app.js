const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user');
const ConnectDb = 'mongodb+srv://wanx:Wanx12@tut-cluster.xh1qy7a.mongodb.net/UserData?retryWrites=true&w=majority'
const app = express();
const { Socket } = require('socket.io');
const http  = require('http');
const HttpServer = http.createServer(app);
const io = require('socket.io')(HttpServer);
var userName='';
const users = {};
var onlineUsers=0;


mongoose.connect(ConnectDb)
.then((result)=> HttpServer.listen(3000,()=>
console.log('server is ready')
))
.catch((err)=>console.log(err))

app.set('view engine', 'ejs');

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('update',onlineUsers);
  
  users[socket.id] =userName;

  console.log(`${users[socket.id]} connected`);

  socket.on('typing', () => {
   
    console.log(`${users[socket.id]} is typing`);
   
  });

  socket.on('chat message', (msg) => {
    const userId = userName;
    var mess = `${users[socket.id]}: ${msg}`;
    console.log(mess);
    io.emit('display', mess);
  });

  socket.on('disconnect', () => {
    onlineUsers--;
    console.log(`${userName} disconnected`);
    delete users[userName];
  });
})

app.get('/',(req,res)=>{
res.render('index');

})

app.get('/chat',(req,res)=>{
  res.render('chat');
 
  
  
  })
app.use(express.urlencoded({extended:true}));



app.get('/create',(req,res)=>{
    res.render('createAccount');
    
    })

    app.post('/create',async (req,res)=>{
        const loginUser=  await User.findOne(req.body)
        if(loginUser){
            res.render('AccountCreated');
        }
        else{
          console.log(req.body);
            const addUser = new User(req.body);
            addUser.save();
            console.log("User Saved");
            res.send('Account Created')
            
        }
      
        
        })

app.get('/login',(req,res)=>{
        res.render('login');
        
        
        })
        var logedin=''

app.post('/login',async (req,res)=>{
      const loginUser=  await User.findOne(req.body)
      if(!loginUser){
        res.render('notfound')
      }

      if(loginUser){
        userName = loginUser.UserName;
        res.render('AccountDetails',{loginUser})


      }
      else{
        res.render('notfound')
      }
    })


app.use((req,res)=>{
res.send('page not found');
    })

  
    