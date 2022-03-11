import {app, Request, Response, session, port} from './other/app-info'
import { TodoNames, TodoRow, User } from './models/models';
import connection from './other/connection'
import bcrypt from 'bcrypt'

app.post('/register', async(req: Request, res: Response): Promise<void> => {
    const {user, pass, apikey} = req.body;
    //if(apikey == process.env.API_KEY) {
        if(user.length > 5) {
            const existsUser = await User.findOne({where: {username: user}});
            if(!existsUser) {
                bcrypt.hash(pass, 10).then(async(hash) => {
                    const createdUser = await User.create({username: user, password: hash});
                    res.send(`Successfully registered as ${createdUser.username} You can now login!`);
                });
            } else res.send('This user with given username already exists! Try to log in!');
        } else res.send('Username length must be more than 6 characters!');
    //} else res.send('Incorrect API key');
});

app.post('/login', async(req: Request, res: Response): Promise<void> => {
    const {user, pass, apikey} = req.body;
    //if(apikey == process.env.API_KEY) {
        if(!req.session.userprofile) {
            const existsUser = await User.findOne({where: {username: user}});
            if(existsUser) {
                bcrypt.compare(pass, existsUser.password, (err, result) => {
                    if(result) {
                        req.session.userprofile = {user, pass};
                        res.send('Successfully logged in!');
                    } else res.send('Password for this account is incorrect!');
                });
            } else res.send('This user does not exist!');
        } else res.send('You are already logged in!');
    //} else res.send('Incorrect API key!');
});

app.get('/logout', async(req: Request, res: Response): Promise<void> => {
    if(req.session.userprofile) {
        req.session.destroy((err) => {});
        res.send('Successfully logged out!');
    } else res.send('You have not even logged in yet!');
});

app.get('/todo/all', async(req: Request, res: Response): Promise <void> => {
    const {apikey} = req.body;
    //if(apikey == process.env.API_KEY) {
        const todos = await TodoNames.findAll();
        res.send(JSON.stringify(todos));
    //} else res.send('Incorrect API key');
});

app.get('/todo/task/delete/:id/', async(req: Request, res: Response): Promise <void> => {
    const { id } = req.params;
    if(req.session.userprofile) {
        const checkID = await TodoRow.findByPk(id);
        const checkList = await TodoNames.findOne({where: {title: checkID?.title}});
        if(checkList?.createdby.includes(req.session.userprofile.user)) {
            const destroyTask = await TodoRow.destroy({where: {id: id}});
            if(destroyTask) {
                res.send('Task successfully deleted!');
            } else res.send('Task could not be deleted!');
        } else res.send('This task is not yours to delete!');
    } else res.send('You must be logged in in order to delete tasks!');
});

app.post('/todo/create', async(req: Request, res: Response): Promise <void> => {
    const { apikey, title, createdby} = req.body;
    //if(apikey == process.env.API_KEY) {
        if(req.session.userprofile) {
            if(title.length > 5) {
                const listName = await TodoNames.findOne({where: {title: title}});
                if(!listName) {
                    const newUser = await TodoNames.create({title: title, createdby: createdby });
                    res.send('TODO list has been successfully created. Add something to it.');
                } else res.send('This TODO list is already created, complete it first and delete it');
            } else res.send('Title must be more than 5 characters long!');
        } else res.send('Only logged-in users can add to TODO list');
    //} else res.send('Incorrect API key!');
});

app.post('/todo/delete/:id', async(req: Request, res: Response): Promise <void> => {
    if(req.session.userprofile) {
        const { id } = req.params;
        const deleteList = await TodoNames.findByPk(id);
        if(deleteList?.createdby.includes(req.session.userprofile.user)) {
            const allIds = await TodoRow.findAll({where: {title: deleteList.title}});
            allIds.every(async(taskInList) => await taskInList.destroy());
            await deleteList.destroy();
            res.send('List and its tasks have been successfully destroyed!');
        } else res.send('This list is not yours to delete!');
    } else res.send('You must be logged in in order to delete TODO list!');
});

app.post('/todo/addtask', async(req: Request, res: Response): Promise<void> => {
    const {title, deadline, text} = req.body;
    if(req.session.userprofile) {
        const existTitle = await TodoNames.findOne({where: {title: title}});
        if(existTitle && existTitle.createdby.includes(req.session.userprofile.user)) {
            if(text.length > 5) {
                await TodoRow.create({title: title, text: text, deadline: deadline, createdby: req.session.userprofile.user, flags: 'ACTIVE'});
                res.send('Task successfully added!');
            } else res.send('Text should contain at least 5 characters.');
        } else res.send('This TODO list title does not exist or this is not your TODO list to manage!');
    } else res.send('You must be logged in in order to add tasks!');
});

//:id - listid
app.post('/todo/list/:id/useradd', async(req: Request, res: Response): Promise<void> => {
    if(req.session.userprofile) {
        const { id } = req.params;
        const { user } = req.body;
        const currList = await TodoNames.findByPk(id);
        if(!currList?.createdby.includes(user)) {
            const userExist = await User.findOne({where: {username: user}});
            if(userExist) {
                if(currList?.createdby.includes(req.session.userprofile.user)) {
                    currList?.set({createdby: currList.createdby + "," + user});
                    await currList?.save();
                    res.send(`User added to ${currList?.title} list as an moderator.`);
                } else res.send('You are not authorized to edit managers of this list!');
            } else res.send('This user does not exist!');
        } else res.send('This user is already a part of this list!');
    } else res.send('If you want to add a user to your list, you need to be logged in!');
});

app.post('/todo/list/:id/userdelete', async(req: Request, res: Response): Promise<void> => {
    if(req.session.userprofile) {
        const { id } = req.params;
        const { user } = req.body;
        const currList = await TodoNames.findByPk(id);
        if(currList?.createdby.includes(user)) {
            const userExist = await User.findOne({where: {username: user}});
            if(userExist) {
                if(currList?.createdby.includes(req.session.userprofile.user)) {
                    currList?.set({createdby: currList.createdby.replace(user, '')});
                    await currList?.save();
                    res.send(`User removed from ${currList?.title} list.`);
                } else res.send('You are not authorized to edit managers of this list!');
            } else res.send('This user does not exist!');
        } else res.send('This user is not a manager in this list!');
    } else res.send('If you want to add a user to your list, you need to be logged in!');
});

app.post('/todo/task/:id/changeflag', async(req: Request, res: Response): Promise<void> => {
    if(req.session.userprofile) {
        const { id } = req.params;
        const { flags } = req.body;
        const oneChange = await TodoRow.findByPk(id);
        if(flags == "Active" || flags == "Done" || flags == "Remove") {
            oneChange?.set({flags: flags});
            await oneChange?.save();
            res.send('Flags successfully set!');
        } else res.send('This flag does not exist!');
    } else res.send('You must be logged in in order to change task flags');
})

module.exports = {};