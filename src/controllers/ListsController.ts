require('dotenv').config({path: __dirname + '/../../.env'});
import {List, User, ListItem} from '../../models/index'

export const getAllLists = async(req, res) : Promise<void> => {
    const lists = await List.findAll();
    if(!lists) return res.send({ok: false, message: 'Ziadny zaznam z listov nie je k dispozicii'});
    return res.send({ok: true, lists: lists});
}

export const getAllListItems = async(req, res) : Promise<void> => {
    const { id } = req.params;
    const list = await List.findByPk(id);
    if(!list) return res.send({ok: false, message: 'Tento list neexistuje!'});
    const listItems = await list.getListItems();
    return res.send({ok: true, items: listItems});
}

export const getUsersInList = async(req, res) : Promise<void> => {
    const { id } = req.params;
    const list = await List.findByPk(id);
    if(!list) return res.send({ok: false, message: 'Tento list neexistuje!'});
    const usersAssociated = await list.getUsers();
    return res.send({ok: true, users: usersAssociated});
}

export const createList = async(req, res) : Promise<void> => {
    const { name } = req.body;
    if(typeof (name && req.verified) !== 'undefined') {
        if(name.length < 5) return res.send('List neobsahuje dostatocny pocet znakov!');

        const newList = await List.create({ name: name });
        await newList.addUsers(req.decodedToken.id);

        return res.send({ok: true, message: `List s názvom ${name} úspešne vytvorený`});
    } else return res.send({ok: false, message: 'Chybne zadané údaje alebo nie si prihlásený!'});
}

export const deleteList = async(req, res) : Promise<void> => {
    const { id } = req.params;
    if(typeof (id && req.verified) !== 'undefined') {
        const currentList = await List.findByPk(id, {include: User});
        if(currentList === null) return res.send({ok: false, message: 'Tento list neexistuje!'});
        const userExist = await currentList.getUsers({where: {id: req.decodedToken.id}});
        if(userExist.length === 0) return res.send({ok: false, message: 'Tento list nie je tvoj na vymazanie!'});
        await currentList.destroy();
        return res.send({ok: true, message: `List ${currentList.name} úspešne vymazaný!`});
    
    } else return res.send({ok: false, message: 'Chybne zadané údaje alebo nie si prihlásený!'});
}

export const addItemToList = async(req, res) : Promise<void> => {
    const { title, text, deadline, id, creator } = req.body;
    if(typeof (id && req.verified && title && text && deadline && creator) !== 'undefined') {
        const currentList = await List.findByPk(id);
        if(currentList === null) return res.send({ok: false, message: 'Tento list neexistuje!'});
        const userExist = await currentList.getUsers({where: {id: req.decodedToken.id}});
        if(userExist.length === 0) return res.send({ok: false, message: 'Tento list nie je tvoj na pridavanie novych položiek!'});
        await ListItem.create({
            title: title,
            text: text,
            deadline: deadline,
            creator: creator,
            listId: id,
            flag: 'aktívna'
        });
        return res.send({ok: true, message: `Polozka s nazvom ${title} úspešne pridaná.`});
    } else return res.send({ok: false, message: 'Chybne zadané údaje alebo nie si prihlásený!'});
}

export const removeItemFromList = async(req, res) : Promise<void> => {
    const { listId, id } = req.params;
    if(typeof (listId && id && req.verified) !== 'undefined') {
        const existsList = await List.findByPk(listId);
        if(existsList === null) return res.send({ok: false, message: 'Tento list neexistuje!'});
        const itemExists = await ListItem.findByPk(id);
        if(itemExists === null) return res.send({ok: false, message: 'Toto ID itemu neexistuje.'});
        const userExist = await existsList.getUsers({where: {id: req.decodedToken.id}});
        if(userExist.length === 0) return res.send({ok: false, message: 'Tento list nie je tvoj na odstranovanie položiek!'});
        await ListItem.destroy({where: {listId: listId, id: id}});
    } else return res.send({ok: false, message: 'Chybne zadané údaje alebo nie si prihlásený!'});
}

export const addUserToList = async(req, res) : Promise<void> => {
    const { userId, listId } = req.body;
    if(typeof (listId && req.verified) !== 'undefined') {
        const existsList = await List.findByPk(listId);
        const existsUser = await User.findByPk(userId);
        if(existsUser === null) return res.send({ok: false, message: 'Zadany pouzivatel neexistuje v databazi!'});
        if(existsList === null) return res.send({ok: false, message: 'Tento list neexistuje!'});
        const userExists = await existsList.getUsers({where: {id: req.decodedToken.id}});
        if(userExists.length === 0) return res.send({ok: false, message: 'Nie si opravneny pridavat ludi do tohto zoznamu!'});
        await existsList.addUser(userId);
        return res.send({ok: true, message: 'Uzivatel uspesne pridany do listu!'});
    } else return res.send({ok: false, message: 'Chybne zadané údaje alebo nie si prihlásený!'});
}

export const setItemFlag = async(req, res) : Promise<void> => {
    const { listId, itemId, value } = req.body;
    if(typeof (listId && itemId && value && req.verified) !== 'undefined') {
        const existsList = await List.findByPk(listId);
        if(!existsList) return res.send({ok: false, message: 'Tento list neexistuje'});
        const item = await existsList.getListItems({where: {id: itemId}});
        if(!item) return res.send({ok: false, message: 'Tento item v liste neexistuje'});
        const flag = value === 1 ? 'aktívna' : value === 2 ? 'dokončená' : value === 3 ? 'zrušená' : undefined;
        if(flag === undefined) return res.send({ok: false, message: 'Tento flag nie je rozpoznateľný!'});
        await ListItem.update({flag: flag}, {where: {id: itemId}});
        return res.send({ok: false, message: `Flag zmenený na ${flag}`});
    } else return res.send({ok: false, message: 'Chybne zadané údaje alebo nie si prihlásený!'});
}

export const removeUserFromList = async(req, res) : Promise<void> => {
    const { listId, userId } = req.params;
    if(typeof (listId && userId && req.verified) !== 'undefined') {
        const existsList = await List.findByPk(listId);
        if(!existsList) return res.send({ok: false, message: 'Tento list neexistuje!'});
        const userExists = await existsList.getUsers({where: {id: userId}});
        const totalUsers = await existsList.getUsers();
        const canRemove = await existsList.getUsers({where: {id: req.decodedToken.id}});
        if(canRemove.length === 0) return res.send({ok: false, message: 'Nie si opravneny narabat s listom!'});
        if(userExists.length === 0) return res.send({ok: false, message: 'Tento uzivatel nie je pridany v liste'});
        if(totalUsers.length === 1) return res.send({ok: false, message: 'Nemozno odstranit posledneho uzivatela z listu!'});
        await existsList.removeUser(userId);
        return res.send({ok: true, message: `Uzivatel s ID ${userId} uspesne odstraneny!`});
    } else return res.send({ok: false, message: 'Chybne zadané údaje alebo nie si prihlásený!'});
}

export const getExactList = async(req, res) : Promise<void> => { 
    const { id } = req.params;
    const exactList = await List.findOne({where: {id: id}});
    if(!exactList === null) return res.send({ok: false, message: 'Tento list neexistuje'});
    return res.send({ok: true, list: exactList});
}

export const getExactItem = async(req, res) : Promise<void> => { 
    const { listId, id } = req.params;
    const exactList = await List.findOne({where: {id: listId}});
    if(!exactList === null) return res.send({ok: false, message: 'Tento list neexistuje'});
    const item = await exactList.getListItems({where: {id: id}});
    if(!item === null) return res.send({ok: false, message: 'Polozka v tomto liste neexistuje'});
    return res.send({ok: true, item: exactList});
}

