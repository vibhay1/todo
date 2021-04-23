const express = require('express');
const bp = require('body-parser');
const date=require(__dirname+'/date.js');
const app = express();


const port = process.env.PORT || 3080;

app.set("view engine", "ejs");
app.use(bp.urlencoded({extended:true}));
app.use(express.static("public"));

let todoList=['Buy food','Cook food','Lunch food'];
let workList=[];

app.get('/', (req, res) => {
  const menu={todo:'TO-DO', work:'WORK',about:'ABOUT'}
  res.render('index',{menu}); //RENDER THE PAGE
});

// TO DO LIST CODE BEGIN HERE!
app.get('/todo', (req, res) => {
  const today=date.getDay();  
  res.render('list',{type:'todo',listTitle:today,newList:todoList}); //RENDER THE PAGE
});

app.post('/todo',(req,res)=>{
  if(req.body.list==='todo'){
  todoList.push(req.body.newItem);
  res.redirect('/todo');
  }else{
    workList.push(req.body.newItem);
    res.redirect('/work');
  }
});
// TODO LIST CODE END HERE!

//ABOUT PAGE BEGIN HERE!
app.get('/about',(req,res)=>{
res.render('about',{listTitle:'Know about us!'});
});
//ABOUT PAGE END HERE!

//WORK PAGE BEGIN HERE!
app.get('/work',(req,res)=>{
  res.render('list',{type:'work',listTitle:'Welcome, add work List!',newList:workList});
  });
  //WORK PAGE END HERE!
app.get('/success', (req, res) => {
  res.render('success'); //TO SUCCESS PAGE
});
app.listen(port, () => console.log(`Server is running on http://127.0.0.1:${port}`));





//   function serveStaticFile(res, path, contentType, responseCode = 200) {
//     fs.readFile(__dirname + path, (err, data) => {
//       if(err) {
//         res.writeHead(500, { 'Content-Type': 'text/plain' })
//         return res.end('500 - Internal Error')
//       }
//       res.writeHead(responseCode, { 'Content-Type': contentType })
//       res.end(data)
//     })
//   }

//   const server = http.createServer((req,res) => {
//     // normalize url by removing querystring, optional trailing slash, and
//     // making lowercase
//     const path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase()
//     switch(path) {
//       case '':
//         ejs.render('/public/home',{title:'Home Page'});
//         //serveStaticFile(res, '/public/home.html', 'text/html')
//         break
//       case '/about':
//         serveStaticFile(res, '/public/about.html', 'text/html')
//         break
//       case '/img/logo.png':
//         serveStaticFile(res, '/public/img/logo.png', 'image/png')
//         break
//       default:
//         serveStaticFile(res, '/public/404.html', 'text/html', 404)
//         break
//     }
//   })
// server.listen(port, () => console.log(`server started on port ${port}; ` +
//   'press Ctrl-C to terminate....'))



/* THIS CODE FOR CORE NODE
const http=require('http');
const port=3080;
const hostName='127.0.0.1';

http.createServer((req,res)=>{
    res.end("Hello Dear");
}).listen(port,hostName,()=>{
   console.log(`Hello your server running on http://${hostName}:${port}/`);
});*/


// API KEY
//list id  a3a3286575
// 98e2ca09ae451fae5792ce2e4e84a707-us1