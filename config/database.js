const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database'
mongoose.connect(MONGODB_URI)