var mongoose = require('mongoose');

const connectDB = async ()  =>  {
    try {
        await mongoose.connect("mongodb+srv://mustafaebid:14552727As@cluster0.6u5f7oq.mongodb.net/saraha?retryWrites=true&w=majority");
    } catch (err) {
        console.log(err);
    }
}


export default connectDB    