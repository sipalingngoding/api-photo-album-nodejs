const app = require('./app');

const PORT = 8000;

app.listen(PORT,()=>{
    console.log('Server sudah berjalan di http://localhost:' +PORT);
});