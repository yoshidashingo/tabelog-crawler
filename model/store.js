import mongoose from "mongoose";

const { Schema } = mongoose;

const storeSchema = new Schema({
    name: String,
    category: String,
    tel: String,
    address: String,
    url: {
        type: String,
        required: true
    },
    status: { type: String, enum: ['pending', 'done'], default: 'pending' }
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
export default Store;
