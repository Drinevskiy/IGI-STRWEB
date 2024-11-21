import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    header: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 3000,
        trim: true
    },
    image: {
        type: String, // Храните путь к изображению
        required: true
    },
    publication_date: {
        type: Date,
        required: true,
        default: Date.now // Устанавливает дату публикации по умолчанию
    }
}, {
    timestamps: true // Добавляет поля createdAt и updatedAt
});

// Для удобства отображения
newsSchema.methods.toString = function() {
    return this.header;
};

export default mongoose.model('NewModel', newsSchema);