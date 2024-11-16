import NewModel from "../models/New.js";

export const getAll = async (req, res) => {
    try{
        const news = await NewModel.find();
        res.json(news);
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось получить все новости.'
        });
    }
}

export const getOne = async (req, res) => {
    try{
        const id = req.params.id;
        const news = await NewModel.findById(id);
        res.json(news);
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось получить новость.'
        });
    }
}

export const create = async (req, res) => {
    try{
        const doc = new NewModel({
            header: req.body.header,
            description: req.body.description,
            image: req.body.image, 
            publication_date: req.body.publication_date 
        });
        const news = await doc.save();
        res.json(news); 
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось добавить новость.'
        });
    }
}

export const update = async (req, res) => {
    try{
        const id = req.params.id;
        await NewModel.findByIdAndUpdate(id,{
            header: req.body.header,
            description: req.body.description,
            image: req.body.image, 
            publication_date: req.body.publication_date 
        });
        res.json({
            success: true
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось обновить новость.'
        });
    }
}

export const remove = async (req, res) => {
    try{
        const id = req.params.id;
        const news = await NewModel.findByIdAndDelete(id);
        res.json({
            success: true
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось удалить новость.'
        });
    }
}