const mongoose = require('mongoose');

main().catch(err => console.log(err));
mongoose.Promise = global.Promise;

async function main() {
    await mongoose.connect(process.env.DB_URI);
}