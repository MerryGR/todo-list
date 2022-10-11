require('dotenv').config({path: __dirname + '/../../.env'});
import {containsNumber} from '../utils/checkNumber'
import {User} from '../../models/index'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

export const register = async(req, res) : Promise<void> => {
   const errors = new Array();
   const {username, password, repeatPassword} = req.body;

   const userExists = await User.findOne({ where: { username: username } });

   if(typeof (username && password && repeatPassword) !== 'undefined') {
        
        if(!userExists) {
            if(username.length < 5)
                errors.push('Pouzivatelske meno nie je dost dlhe!');
            
            if(password.length < 5 || containsNumber(password) === false)
                errors.push('Heslo nie je dostatocne dlhe alebo zabezpecene!');
            
            if(password !== repeatPassword)
                errors.push('Heslá sa nezhodujú!');

            if(errors.length === 0) {
                await User.create({
                    password: crypto.pbkdf2Sync(password, process.env.SALT, 1000, 64, `sha512`).toString(`hex`),
                    username: username
                });
                return res.send({ok: true, errors: ['Uspesne zaregistrovany!']});
            } else return res.send({ok: false, errors: errors});

        } else return res.send({ok: false, errors: ['Uzivatel uz existuje!']});

   } else res.send({ok: false, errors: ['Nevyplnene hodnoty!']});

}

export const login = async(req, res) : Promise<void> => {
    const errors = new Array();
    const {username, password} = req.body;

    if(typeof (username && password) !== 'undefined') {

        const checkUser = await User.findOne({ where: { 
            username: username, 
            password: crypto.pbkdf2Sync(password, process.env.SALT, 1000, 64, `sha512`).toString(`hex`)} 
        });

        if(checkUser) {
            const token = jwt.sign({id: checkUser.id}, process.env.TOKEN_KEY, {expiresIn: '2h'});
            res.cookie('JWT', token, {
                maxAge: 7_200_000, //2hrs
                httpOnly: true
            });
            return res.send({ok: true, message: 'Úspešne prihlásený!'});
        } else return res.send({ok: false, message: 'Údaje nie sú správne!'});

    } else res.send({ok: false, message: 'Chybne zadané údaje!'});
}
