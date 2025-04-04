const http = require('http');
const mongoose = require('mongoose');

const str = `mongodb+srv://Alevice:8<tAyi"25yQd@cluster0.wa0ajam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(str, {})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(`Connection error ${err}`));

const numizmaticShema = new mongoose.Schema({
    penny_name: String,
    penny_description: String,
    penny_metal: String,
    penny_period: String,
    penny_price: Number
});

const Numizmatics = mongoose.model('Numizmatics', numizmaticShema);

const server = http.createServer(async (req, res) => {

    if (req.method === 'GET' && req.url === '/all') {

        try {
            const numizmatics = await Numizmatics.find();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(numizmatics));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error fetching numismatics' }));
        }

    } else if (req.method === 'POST' && req.url === '/add') {

        let body = "";
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { penny_name, penny_description, penny_metal, penny_period, penny_price } = JSON.parse(body);

                const newNumizmatics = new Numizmatics({
                    penny_name,
                    penny_description,
                    penny_metal,
                    penny_period,
                    penny_price
                });

                await newNumizmatics.save();

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Numizmatic added successfully', numizmatic: newNumizmatics }));

            } catch (error) {
                if (!res.headersSent) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid data format or missing fields' }));
                }
            }
        });

    } else if (req.method === "DELETE" && req.url === '/delete') {
        
        let body = "";
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { pennyId } = JSON.parse(body);
                console.log('Attempting to delete penny with ID:', pennyId);

                if (!mongoose.Types.ObjectId.isValid(pennyId)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid pennyId format' }));
                    return;
                }

                const result = await Numizmatics.deleteOne({ _id: pennyId });

                if (result.deletedCount === 1) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Numizmatic was deleted!', pennyId }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Numizmatic was not found!' }));
                }
            } catch (error) {
                console.error('Error occurred while deleting numizmatic:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'An error occurred while deleting numizmatic' }));
            }
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error with connection!' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
