// Entry point for the application
const express = require('express');
const app = express();
const routes = require('./src/routes');

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
