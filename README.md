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
`/posts/all` - získa všetky listy z databázi.<br/>
<b>Oprávnenia: </b>žiadne<br/>
<b>Parametre v URL:</b> žiadne<br/>