# Todo List
Todo List je projekt, pomocou ktorého je možné pridávať a odstraňovať listy. Každý list má svoje položky, ktoré uživateľ môže svojvoľne začiarknúť ako vyriešené, nevyriešené a odstránené. Do jednotlivých listov je možnosť pridávať aj uživateľov, ktorý budú môcť spravovať jednotlivé listy.
## Spustenie projektu
Ako prvé pri uložení projektu je potrebné nainštalovať všetky možné dodatky, s ktorými kód pracuje.<br/>
Príkazom `npm i` sa dodatky automaticky nainštalujú.<br/><br/>
Akonáhle sa všetky dodatky nainštalovali, je potrebné skompilovať Typescript projekt.<br/>
Typescript projekt sa skompiluje v zložke `backend/` príkazom `tsc`. <br/><br/>
Ak je projekt skompilovaný, je čas spustiť kód. <br/>
Príkazom `node dist/app.js` sa spustí kód, ktorý zapne HTTP server a začne 'načúvať' requestom zo strany uživateľa.
## API Príkazy
API príkazy slúžia na komunikáciu medzi uživateľom a serverom. Uživateľ môže získavať, pridávať, odstraňovať dáta v databáze. Tieto operácie závisia od oprávnení uživateľa.
### Requesty GET
`/lists/all` - získa všetky listy z databázi.<br/>
<b>Oprávnenia: </b>žiadne<br/>
<b>Parametre v URL:</b> žiadne<br/>
<b>Return:</b> `{ok : bool, lists : Array}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `lists` - Array listov (ak `ok === false`, tak `message` namiesto `lists`)<br/><br/>

`/lists/getlist/:id` - získa konkrétny list z databázi.<br/>
<b>Oprávnenia: </b>žiadne<br/>
<b>Parametre v URL:</b> id - ID konkrétneho listu<br/>
<b>Return:</b> `{ok : bool, list : Array}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `list` - konkrétny list (ak `ok === false`, tak `message` namiesto `list`)<br/><br/>

`/lists/allitems/:id` - získa všetky položky z konkrétneho listu.<br/>
<b>Oprávnenia: </b>žiadne<br/>
<b>Parametre v URL:</b> id - ID konkrétneho listu<br/>
<b>Return:</b> `{ok : bool, items : Array}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `items` - Array položiek (ak `ok === false`, tak `message` namiesto `items`)<br/><br/>

`/lists/getitem/:id/:itemId` - získa konkrétnu položku z listu.<br/>
<b>Oprávnenia: </b>žiadne<br/>
<b>Parametre v URL:</b> id - ID konkrétneho listu, itemId - ID konkrétnej položky<br/>
<b>Return:</b> `{ok : bool, item: Array}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `item` - jedna položka (ak `ok === false`, tak `message` namiesto `item`)<br/><br/>

`/lists/allusers/:id` - získa všetkých uživateľov pridaných v konkrétnom liste.<br/>
<b>Oprávnenia: </b>žiadne<br/>
<b>Parametre v URL:</b> id - ID konkrétneho listu<br/>
<b>Return:</b> `{ok : bool, users : Array}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `users` - Array použivateľov (ak `ok === false`, tak `message` namiesto `users`)<br/><br/>

### Requesty POST
`/lists/create` - vytvorí list v databázi<br/>
<b>Oprávnenia: </b>prihlásenie (JWT Bearer Token)<br/>
<b>JSON Body:</b> name : <i>string</i><br/>
<b>Return:</b> `{ok : bool, message : string}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `string` - popis stavu requestu<br/><br/>

`/lists/additem` - pridá do listu novú položku<br/>
<b>Oprávnenia: </b>prihlásenie (JWT Bearer Token) + pridaný v liste<br/>
<b>JSON Body:</b> title : <i>string</i>, text : <i>string</i>, deadline : <i>string</i>, creator : <i>string</i>, id : <i>integer</i> (ID listu)<br/>
<b>Return:</b> `{ok : bool, message : string}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `string` - popis stavu requestu<br/><br/>

`/lists/adduser` - pridá do listu novú osobu<br/>
<b>Oprávnenia: </b>prihlásenie (JWT Bearer Token) + pridaný v liste<br/>
<b>JSON Body:</b> userId : <i>integer</i>, listId : <i>integer</i><br/>
<b>Return:</b> `{ok : bool, message : string}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `string` - popis stavu requestu<br/><br/>

`/lists/setflag` - nastaví status aktuálnej položke v liste<br/>
<b>Oprávnenia: </b>prihlásenie (JWT Bearer Token) + pridaný v liste<br/>
<b>JSON Body:</b> listId : <i>integer</i>, itemId : <i>integer</i>, value : <i>integer</i> (1 - aktívne, 2 - dokončené, 3 - vymazané)<br/>
<b>Return:</b> `{ok : bool, message : string}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `string` - popis stavu requestu<br/><br/>

`/users/register` - zaregistruje nového použivateľa<br/>
<b>Oprávnenia: </b>žiadne<br/>
<b>JSON Body:</b> username : <i>string</i>, password : <i>string</i>, repeatPassword : <i>string</i><br/>
<b>Return:</b> `{ok : bool, message : string (alebo errors : Array)}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `errors` - popis stavu requestu (ak `ok === false`, tak `errors` namiesto `message`)<br/><br/>

`/users/login` - prihlási registrovaného použivateľa a JWT token uloží do cookie session medzi serverom a uživateľom.<br/>
<b>Oprávnenia: </b>žiadne<br/>
<b>JSON Body:</b> username : <i>string</i>, password : <i>string</i><br/>
<b>Return:</b> `{ok : bool, message : string (alebo errors : Array)}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `errors` - popis stavu requestu (ak `ok === false`, tak `errors` namiesto `message`)<br/><br/>

### Requesty DELETE
`/lists/:id` - vymaže konkrétny list<br/>
<b>Oprávnenia: </b>prihlásenie (JWT Bearer Token) + pridaný v liste<br/>
<b>Parametre v URL:</b> id - ID konkrétneho listu<br/>
<b>Return:</b> `{ok : bool, message : string}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `string` - popis stavu requestu<br/><br/>

`/lists/remove-item/:listId/:id` - vymaže z listu konkrétnu položku<br/>
<b>Oprávnenia: </b>prihlásenie (JWT Bearer Token) + pridaný v liste<br/>
<b>Parametre v URL:</b> id - ID konkrétnej položky, listId - ID konkrétneho listu<br/>
<b>Return:</b> `{ok : bool, message : string}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `string` - popis stavu requestu<br/><br/>

`/lists/removeuser/:listId/:userId` - vymaže z listu konkrétneho uživateľa<br/>
<b>Oprávnenia: </b>prihlásenie (JWT Bearer Token) + pridaný v liste<br/>
<b>Parametre v URL:</b> listId - ID konkrétneho listu, userId - ID konkrétneho uživateľa<br/>
<b>Return:</b> `{ok : bool, message : string}`<br/>
<b>Atribúty:</b> `ok` [true/false] - request bol úspešný/neúspešný, `string` - popis stavu requestu<br/><br/>
