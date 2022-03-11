# todo-list
![Up to Date](https://github.com/ikatyang/emoji-cheat-sheet/workflows/Up%20to%20Date/badge.svg)
<h2>:blue_book: General Info</h2>
<p>TODO list runs on NodeJS where users can freely register & login. Every user has their own TODO lists which can be managed by the managers. Lists should contain tasks which user has to complete. These tasks can be either set to Done, Active or Removed. You can also call it task's flags.</p>
<p>You can either interact with the TODO list via very simple website or you can choose to access it via API, which is public.</p>

<h2>:wrench: How To Setup</h2>
<p>In order to access the simple EJS content or API from any other 3d party program, you should start the server at first.</p>
<ul>
  <li>Download the files</li>
  <li>Open the terminal</li>
  <li>Install all the packages by writing this command in the terminal: <code>npm i</code></li>
  <li>Start the HTTP server by starting the code using this command: <code>node index.js PORT={number}</code> - <b>PORT parameter should be specified for the server to be started on the specific port!</b></li>
  <li>On the other hand, you are also capable to start the HTTP server as developer using the <b>Nodemon</b> package by typing: <code>npm run dev PORT={number}</code></li>
</ul>

<h2>:key: API Calls</h2>
<p>TODO content can be managed by API calls, which are shown below:</p>

<p><code>POST: /register</code> - <i>registers the user and inserts him inside the database</i></p>
<p>Requirements:</p>
<ul>
  <li>Body: <code>{ "user": "USERNAME", "pass": "PASSWORD" }</code></li>
</ul>

<p><code>POST: /login</code> - <i>logs in the user and creates a session</i></p>
<p>Requirements:</p>
<ul>
  <li>Body: <code>{ "user": "USERNAME", "pass": "PASSWORD" }</code></li>
</ul>

<p><code>GET: /logout</code> - <i>logs out the user</i></p>
<p>Requirements:</p>
<ul>
  <li>User must be logged in</li>
</ul>

<p><code>GET: /todo/all</code> - <i>gets all the TODO lists in the database</i></p>
<p>Requirements:</p>
<ul>
  <li>None</li>
</ul>

<p><code>POST: /todo/create</code> - <i>creates the TODO list in the database</i></p>
<p>Requirements:</p>
<ul>
  <li>User must be logged in</li>
  <li>Body: <code>{ "title": "TITLE NAME", "createdby": "CREATED BY NAME" }</code></li>
</ul>

<p><code>GET: /todo/addtask</code> - <i>adds the task to a certain TODO list</i></p>
<p>Requirements:</p>
<ul>
  <li>User must be logged in</li>
  <li>Body: <code>{ "title": "TITLE OF LIST WHERE TASK SHOULD BE ADDED", "deadline": "WHEN THE TASK ENDS", "text": "INFO ABOUT TASK" }</code></li>
</ul>

<p><code>GET: /todo/task/delete/:id/</code> - <i>deletes the task from the certain TODO list</i></p>
<p>Requirements:</p>
<ul>
  <li>User must be logged in</li>
  <li><code>:id</code> must be replaced with the task's ID</li>
</ul>

