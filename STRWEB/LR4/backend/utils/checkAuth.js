import jwt from 'jsonwebtoken';

export default async(req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if(token){
        try{
            const decoded = jwt.verify(token, 'randomkey');
            req.userId = decoded.id;
            next();
        } catch(err){
            return res.status(403).json({
                message: "Отказано в доступе"
            });
        }
    }
    else{
        return res.status(403).json({
            message: "Отказано в доступе"
        });
    }
};