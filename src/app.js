
const express = require('express');
const webpush = require("web-push");
const fs = require('fs');
const path = require('path');

const app = express();


// Settings
app.set('port', process.env.PORT || 3000);
app.set('public', path.join(__dirname,'public')); //No se para que ese usa



// Middlewares
app.use(express.json());    // for parsing application/json
app.use(express.urlencoded({extended: true}));// for parsing application/x-www-form-urlencoded

// Routes
app.use(require('./routes/index'));

app.use('/create',require('./routes/index'));
/*
app.get('/gallery', (req, res, next) => {
    res.set('Content-Type', 'text/plain');
    res.send(path.join(__dirname,'/public/views/gallery.html'),'utf-8');
});

app.get('/home', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(path.join(__dirname,'/public/views/home.html'),'utf-8');
});

app.get('/blog', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(path.join(__dirname,'/public/views/blog.html'),'utf-8');
});
*/
// Static Files
app.use(express.static(path.join(__dirname,'public')));

// Start Push Notifications 
const publicVapidKey =
  "BIYDfW00wVkR0mxUrB2Cbl-utNcxsvbu-w9p10hoCkUfTeU3ArWTv43IwaKgZc8u2GUWkkp1qplDFfkZzKd5IrU";
const privateVapidKey = "BKgaxa403OgOX6Bbrf1ptRkerwlPirTGha1qNX7pPeU";

const allSubscriptions = fs.readFileSync('src/subscriptions.json', 'utf-8');
let db = JSON.parse(allSubscriptions);

app.post('/save_subscription', function (req, res) {

  const saveSubscription = function(newSubscription){

    const { endpoint,expirationTime,keys } = newSubscription;
    
    if (db.length === 0) {
      console.log(db.length);
  
      console.log('Estoy vacio');
  
      console.log('Soy el primero');
      db.push(newSubscription);
  
      console.log('Se sebscribio el: ',db.length);
  
      const allSubscriptions = JSON.stringify(db);
      fs.writeFileSync('src/subscriptions.json', allSubscriptions, 'utf-8');
  
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ data: { success: true } }));
      
    }else{
  
      let cont = 0;
      db.forEach(el => {
      if (endpoint == el.endpoint) {
        console.log('SI se encontro');
        return cont++;
      }else{
        
      }
      });
  
      if (!cont) {
        console.log('Soy nuevo');
        db.push(newSubscription);
  
        console.log('Se sebscribio');
  
        const allSubscriptions = JSON.stringify(db);
        fs.writeFileSync('src/subscriptions.json', allSubscriptions, 'utf-8');

        console.log('Se sebscribio');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ data: { success: true } }));
      }
  
    }
    
  };
  return saveSubscription(req.body);

});

webpush.setVapidDetails(
  "mailto:test@test.com", 
  publicVapidKey, 
  privateVapidKey);

  app.post('/newpost', (req, res) => {
    // Send 201 - resource created
    res.sendStatus(201);
    
    let promiseChain = Promise.resolve();
    
    db.forEach(subscription => {
      
      const payload = JSON.stringify({ title: req.body.title, message: req.body.message });

      return promiseChain = promiseChain.then(() => {
        console.log('Voy a enviar el push');
        sendToAll(subscription, payload);
        
      });

    });

  });


  const sendToAll = async function(subscription, dataToSend) {
    console.log('Recibi el push');
    return await webpush.sendNotification(subscription, dataToSend)
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log('Subscription has expired or is no longer valid: ', err);
        return deleteSubscriptionFromDatabase(subscription.endpoint);
      } else {
        throw err;
      }
    });
  };
  
 function deleteSubscriptionFromDatabase(id){

  db = db.filter(el => el.endpoint != id);
  const allSubscriptions = JSON.stringify(db);
  fs.writeFileSync('src/subscriptions.json', allSubscriptions, 'utf-8');
  console.log('Se elimino un dato');

 }
// End Push Notifications




module.exports = app;