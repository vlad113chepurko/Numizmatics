const http = require('http');
const mongoose = require('mongoose');

// Подключение к MongoDB
mongoose.connect('mongodb+srv://Alevice:8<tAyi"25yQd@cluster0.wa0ajam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Connection error:", err));

const numizmaticShema = new mongoose.Schema({
    name: String,
    id: Number,
    description: String
});

const Numizmatics = mongoose.model('Numizmatics', String);

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/numizmatics') {
        const numizmatics = await Numizmatics.find();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(numizmaticShema));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Not found" }));
    }
});

// Запуск сервера
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
