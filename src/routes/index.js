const { Router } = require('express');
const router = Router();
const path = require('path');


//const href = req.hostname;

router.get('/home', (req, res) => {
    //res.sendFile(path.join(__dirname,'/public/index.html'));
    //res.send(path.join(__dirname,'public/index.html'));

    console.log(req.baseUrl) // /greet
    res.send(req.baseUrl);
});

router.get('/in', (req, res) => {
    //res.sendFile(path.join(req.hostname,'/public/index.html'));
    //res.send(path.join(__dirname,'public/index.html'));
    console.log(req.hostname);
});

module.exports = router;