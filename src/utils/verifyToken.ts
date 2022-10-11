import * as jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        
        jwt.verify(bearerToken, process.env.TOKEN_KEY, (err, decoded) => {
            if(err) return req.verified = undefined;  //Incorrect token...
            req.decodedToken = decoded;
            return req.verified = true;
        });

        next();
    } else {
        return res.sendStatus(403);
    }
}
