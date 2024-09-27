const app = require('./app'); 

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('DDC API IS RUNNIG... ');
});

const server = app.listen(PORT, ( req,res) => {
    console.log(`Server running on port ${PORT}`);
    
});

app.get('/', (req,res) =>{
    res.send()
});

// Catch-all route for 404 errors
app.use((req, res) => {
    res.status(404).send("404 Not API not found ");
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
