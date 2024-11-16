import PartnerModel from '../models/Partner.js';

export const getAll = async (req, res) => {
    try{
        const partners = await PartnerModel.find();
        res.json(partners);
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось получить всех партнеров.'
        });
    }
}

export const getOne = async (req, res) => {
    try{
        const id = req.params.id;
        const partner = await PartnerModel.findById(id);
        res.json(partner);
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось получить партнера.'
        });
    }
}

export const create = async (req, res) => {
    try{
        const doc = new PartnerModel({
            name: req.body.name,
            url: req.body.url,
            imageUrl: req.body.imageUrl
        });
        const partner = await doc.save();
        res.json(partner); 
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось добавить партнера.'
        });
    }
}

export const update = async (req, res) => {
    try{
        const id = req.params.id;
        await PartnerModel.findByIdAndUpdate(id,{
            name: req.body.name,
            url: req.body.url,
            imageUrl: req.body.imageUrl
        });
        res.json({
            success: true
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось обновить партнера.'
        });
    }
}

export const remove = async (req, res) => {
    try{
        const id = req.params.id;
        const partner = await PartnerModel.findByIdAndDelete(id);
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