import mongoose from 'mongoose';

const AviarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 25,
        trim: true,
        unique: true,
        default: 'Unnamed Aviary'
    },
    square: {
        type: Number,
        required: true,
        min: 1  // Задает минимально допустимое значение для площади
    },
    reservoir: {
        type: Boolean,
        default: false
    },
    heating: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Добавляет поля createdAt и updatedAt
});

// Для удобства отображения
AviarySchema.methods.toString = function() {
    return this.name;
};

export default mongoose.model('AviaryModel', AviarySchema);
