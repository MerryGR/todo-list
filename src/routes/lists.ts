import express from 'express'
import {verifyToken} from '../utils/verifyToken'
import {getAllLists, createList, deleteList, addItemToList, removeItemFromList, addUserToList, getAllListItems, getUsersInList, setItemFlag, removeUserFromList} from '../controllers/ListsController'
var router = express.Router();

//Gets all lists
router.get('/all', getAllLists);
//Create a list (requires a user to be logged in)
router.post('/create', verifyToken, createList);
//A logged in user can delete their list (the creator itself), but not the users associated with it.
router.delete('/:id', verifyToken, deleteList);
//Add items to the list.. only for users associated with the list
router.post('/additem', verifyToken, addItemToList);
//Remove item from the list .. noly for users associated with the list
//listId - ID of the current list, id - item's id.
router.delete('/remove-item/:listId/:id', verifyToken, removeItemFromList);
//Adds the user to the current list (if exists)
router.post('/adduser', verifyToken, addUserToList);
//Gets all the list's items
router.get('/allitems/:id', getAllListItems);
//Gets all the users associated with the current list
router.get('/allusers/:id', getUsersInList);
//Sets the flag of item in the list
router.post('/setflag', verifyToken, setItemFlag);
//Remove user from list
router.delete('/removeuser/:listId/:userId', verifyToken, removeUserFromList);


module.exports = router;