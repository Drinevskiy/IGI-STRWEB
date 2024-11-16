import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20,
        trim: true
    },
    type: {
        type: String,
        required: true,
        maxlength: 20,
        trim: true
    },
    family: {
        type: String,
        required: true,
        maxlength: 20,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500,
        trim: true
    },
    aviary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AviaryModel', // Ссылка на модель Aviary
        required: true
    },
    date_of_receipt: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value <= Date.now();
            },
            message: "Дата поступления не может быть в будущем."
        }
    },
    date_of_birth: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value <= Date.now();
            },
            message: "Дата рождения не может быть в будущем."
        }
    },
    image: {
        type: String, // Храните путь к изображению
        default: 'images/no.jpg',
        required: true
    }
}, {
    timestamps: true // Добавляет поля createdAt и updatedAt
});

// Для удобства отображения
animalSchema.methods.toString = function() {
    return this.name;
};

export default mongoose.model('AnimalModel', animalSchema);