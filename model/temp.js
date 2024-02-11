import mongoose from "mongoose";

function initTemp(date) {
    const { Schema } = mongoose;

    const TempSchema = new Schema({
        url: String
    }, { versionKey: false });

    const Temp = mongoose.model(`Temp_${date}`, TempSchema);
    return Temp;
}

export default initTemp;
