import {app, Request, Response, session, port} from './other/app-info'
import { TodoNames, TodoRow, User } from './models/models';
import connection from './other/connection'
import './api'
import axios from 'axios'


app.get('/todo/create', async(req: Request, res: Response): Promise<void> => {
    if(req.session.userprofile) {
        res.render('create');
    } else res.send('Only logged-in users can add new items in TODO list!');
});


app.get('/todo/list/:id/', async(req: Request, res: Response): Promise <void> => {
    const { id } = req.params;
    const list = await TodoNames.findByPk(id);
    if(list) {
        const allTasks = await TodoRow.findAll({where: {title: list.title}});
        res.render('todo-showlist', {tasks: allTasks, profile: req.session.userprofile, list: list});
    } else res.send('This list does not exist!');

});

app.get('/register', async(req: Request, res: Response): Promise<void> => {
    res.render('register');
});

app.get('/login', async(req: Request, res: Response): Promise<void> => {
    res.render('login');
});

app.get('/todo', async(req: Request, res: Response): Promise<void> => {
    const result = await axios.get(`http://localhost:${port}/todo/all`);
    res.render('todo', {todo: result.data, user: req.session.userprofile});
});

app.get('/todo/addtask', async(req: Request, res: Response): Promise<void> => {
    if(req.session.userprofile) {
        res.render('todo-addtask');

    } else res.send('You must be logged in in order to add tasks!');
});

app.get('/todo/list/:id/useradd', async(req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    const listID = await TodoNames.findByPk(id);
    if(listID) {
        res.render('todo-adduser', {list: listID});
    } else res.send('This list doesnt exist!');
});

app.get('/todo/list/:id/userdelete', async(req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    const listID = await TodoNames.findByPk(id);
    if(listID) {
        res.render('todo-removeuser', {list: listID});
    } else res.send('This list doesnt exist!');
});

app.get('/todo/task/:id/setflag', async(req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    const listID = await TodoRow.findByPk(id);
    if(listID) {
        res.render('todo-changeflags', {list: listID});
    } else res.send('This list doesnt exist!');
});


const start = async(): Promise<void> => {
    try {
        await connection.sync();
        app.listen(port, (): void => {
            console.log(`Server is running on port ${port}`);
        });
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
}

start();

