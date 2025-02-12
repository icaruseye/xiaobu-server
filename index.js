require('dotenv').config()

try {
  const mongoUri = process.env.MONGODB_URI
  if (typeof mongoUri !== 'string') {
    throw new Error('MongoDB URI must be a string')
  }
  await mongoose.connect(mongoUri)
  console.log('MongoDB connected successfully')
  console.log('MongoDB URI:', process.env.MONGODB_URI)
} catch (error) {
  console.error('MongoDB connection error:', error)
  process.exit(1)
} 