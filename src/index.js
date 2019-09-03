//const express = require('express');

const app = require('./app.js')

async function main(){// Listening the server
  await app.listen(app.get('port'), function(){
    console.log(`server listening on port: ${app.get('port')}`);
  });
};

main();

// Para iniciar el Server usar: npm run dev