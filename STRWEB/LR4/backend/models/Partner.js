import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        url: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true, // если поле обязательно
            validate: {
                validator: function(v) {
                    // Валидация URL с использованием регулярного выражения
                    return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(v);
                },
                message: props => `${props.value} is not a valid URL!`
            }
        }
    },{
        timestamps: true
    }
);

export default mongoose.model('PartnerModel', PartnerSchema);