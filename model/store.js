import mongoose from "mongoose";

const { Schema } = mongoose;

const storeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: String,
    tel: String,
    address: String,
    prefectureKey: String,
    prefectureLabel: String,
    areaKey: String,
    areaLabel: String,
    url: {
        type: String,
        required: true
    },
    status: { type: String, enum: ['pending', 'done'], default: 'pending' }
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
export default Store;
