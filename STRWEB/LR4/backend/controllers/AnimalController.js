import AnimalModel from "../models/Animal.js";

export const getAll = async (req, res) => {
    try {
        const animals = await AnimalModel.find().populate('aviary').exec(); // Заполняем данные о вольере
        res.json(animals);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось получить всех животных.'
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const id = req.params.id;
        const animal = await AnimalModel.findById(id).populate('aviary').exec(); // Заполняем данные о вольере
        if (!animal) {
            return res.status(404).json({ message: 'Животное не найдено.' });
        }
        res.json(animal);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось получить животное.'
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new AnimalModel({
            name: req.body.name,
            type: req.body.type,
            family: req.body.family,
            description: req.body.description,
            aviary: req.body.aviary, // Ссылка на вольер
            date_of_receipt: req.body.date_of_receipt,
            date_of_birth: req.body.date_of_birth,
            image: req.body.image
        });
        const animal = await doc.save();
        res.status(201).json(animal);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось добавить животное.'
        });
    }
};

export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {
            name: req.body.name,
            type: req.body.type,
            family: req.body.family,
            description: req.body.description,
            aviary: req.body.aviary, // Ссылка на вольер
            date_of_receipt: req.body.date_of_receipt,
            date_of_birth: req.body.date_of_birth,
        };

        // Проверяем, не является ли image пустой строкой
        if (req.body.image) {
            updateFields.image = req.body.image; // Добавляем image только если оно не пустое
        }
        const updatedAnimal = await AnimalModel.findByIdAndUpdate(id, updateFields, { new: true }); // Возвращаем обновленный документ
        if (!updatedAnimal) {
            return res.status(404).json({ message: 'Животное не найдено.' });
        }

        res.json(updatedAnimal);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось обновить животное.'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const animal = await AnimalModel.findByIdAndDelete(id);
        if (!animal) {
            return res.status(404).json({ message: 'Животное не найдено.' });
        }
        res.json({
            success: true,
            message: 'Животное успешно удалено.'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось удалить животное.'
        });
    }
};