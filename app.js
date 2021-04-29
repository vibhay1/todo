const express = require('express');
const bp = require('body-parser');
const path = require('path');
const mongoose=require('mongoose');
const date=require(path.join(__dirname,'/date.js'));
const app = express();




const port = process.env.PORT || 3080;

app.set("view engine", "ejs");
app.use(bp.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

//mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true }); //TO CONNECT MONGODB WITH MONGOOSE
mongoose.connect("mongodb+srv://admin-vibhay-1:L1@loginvibhay@clusterfirst.bbtun.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true }); //TO CONNECT MONGODB WITH MONGOOSE

const itemSchema={name:String}; //design schema of collection how many field will be created in collection

const Item=mongoose.model('item',itemSchema);// TO CREATE TABLE WITH 'Items' ONLY ENTER IN SINGULAR FORM OF 'Items' like 'item' SECOND PASS FIELD SCHEMA
const List=mongoose.model('List',{name:String,items:[itemSchema]});
const menu={todo:'TO-DO', work:'WORK',about:'ABOUT'}
app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', (req, res) => {
  res.render('index',{path:__dirname,menu}); //RENDER THE PAGE
});

// EXPRESS CREATE DYNAMIC URL

app.get('/:customListName',(req,res)=>{
 const customListUrl= req.params.customListName.substring(0,1).toUpperCase()+req.params.customListName.substring(1).toLowerCase();
 List.findOne({name:customListUrl},(err,result)=>{
if(!err ){
  if(!result){
    const list=new List({name:customListUrl});
    list.save();
    res.redirect('/'+customListUrl);
  }else{
    //const today=date.getDay(); 
    res.render('list',{newList:result}); //RENDER THE PAGE
  }
}else{
  console.log(err);
}
 }); 
});
app.post('/:customListName',(req,res)=>{
  const itemName=req.body.newItem;
  const item = new Item({
    name:itemName
  });
  const customListUrl= req.params.customListName.substring(0,1).toUpperCase()+req.params.customListName.substring(1).toLowerCase();
  if(customListUrl==='Delete'){
    const checkedItemID=req.body.checkbox;
    const listName=req.body.listName;
   List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemID}}},(err,result)=>{
    if(!err){
      res.redirect('/'+listName); //RENDER THE PAGE 
    }
   });
  }else{
  List.findOne({name:customListUrl},(err,foundResult)=>{
    foundResult.items.push(item);
    foundResult.save();
    res.redirect('/'+customListUrl);

  });
}
});
const listInsert=(listName,items={name:String})=>{
  const list=new List({name:listName,items:[items]});
  list.save();
};


//TO DELETE FROM DB
app.post('/delete',(req,res)=>{
  const itemId=req.body.checkbox;
if(req.body.type==="todo"){
  Item.findByIdAndRemove(itemId,(err)=>{
    if(!err){
      res.redirect('/todo');
    }else{
      console.log(err);
    }
  });
}else if(req.body.type==='work'){
  Work.findByIdAndRemove(itemId,(err)=>{
    if(!err){
      res.redirect('/work');
    }else{
      console.log(err);
    }
  });
}
});

//ABOUT PAGE BEGIN HERE!
app.get('/about',(req,res)=>{
res.render('about',{path:__dirname,listTitle:'Know about us!'});
});
//ABOUT PAGE END HERE!


app.get('/success', (req, res) => {
  res.render('success'); //TO SUCCESS PAGE
});

// TO SEARCH ANYTHING
let posts=[];
let search=0;
app.get('/posts', (req, res) => {
  res.render('posts',{path:__dirname,menu,posts:posts});
  //res.send(''); //TO SUCCESS PAGE
});
app.get('/compose', (req, res) => {
  res.render('compose');
  //res.send(''); //TO SUCCESS PAGE
});
app.post('/compose', (req, res) => {
  const post={title:req.body.title,content:req.body.content};
  posts.push(post);
  res.redirect('/posts');
  //res.send(''); //TO SUCCESS PAGE
});

app.get('/posts/:title', (req, res) => {
  const requestTitle=req.params.title.toLowerCase();
  let filterPost=posts.filter((post)=>post.title.toLowerCase()===requestTitle);
  res.render('posts',{path:__dirname,menu,posts:filterPost});
  //res.send(''); //TO SUCCESS PAGE
});
app.listen(port, () => console.log(`Server is running on http://127.0.0.1:${port}`));


