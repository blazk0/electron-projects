const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://amr:amr@cluster0.gsskr.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: 'buglogger',
      }
    );

    console.log('MongoDB Connected');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
