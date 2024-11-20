import AviaryModel from "../models/Aviary.js";

export const getAll = async (req, res) => {
    try{
        const aviaries = await AviaryModel.find();
        res.json(aviaries);
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось получить все вольеры.'
        });
    }
}

export const getOne = async (req, res) => {
    try{
        const id = req.params.id;
        const aviary = await AviaryModel.findById(id);
        res.json(aviary);
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось получить вольер.'
        });
    }
}

export const create = async (req, res) => {
    try{
        const doc = new AviaryModel({
            name: req.body.name,
            square: req.body.square,
            reservoir: req.body.reservoir,
            heating: req.body.heating
        });
        const aviary = await doc.save();
        res.status(201).json(aviary); 
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось добавить вольер.'
        });
    }
}

export const update = async (req, res) => {
    try{
        const id = req.params.id;
        await AviaryModel.findByIdAndUpdate(id,{
            name: req.body.name,
            square: req.body.square,
            reservoir: req.body.reservoir,
            heating: req.body.heating
        });
        res.json({
            success: true
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось обновить вольер.'
        });
    }
}

export const remove = async (req, res) => {
    try{
        const id = req.params.id;
        const aviary = await AviaryModel.findByIdAndDelete(id);
        res.json({
            success: true
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось удалить партнера.'
        });
    }
}