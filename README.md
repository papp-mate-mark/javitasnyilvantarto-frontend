# javitasnyilvantarto-frontend

Fejlesztés alatt álló ékszerjavítás nyilvántartó rendszer frontendje.

A szükséges backend itt érhető el: https://github.com/papp-mate-mark/javitasnyilvantarto

<h3>Előkövetelmények</h3>

- [Node.js](https://nodejs.org/en)
- [Backend szerver](https://github.com/papp-mate-mark/javitasnyilvantarto)

<h3>Fejlesztő/debug szerver indítása</h3>

Először a `npm install` segítségével telepítse a szükséges függőségeket, majd a `ng serve` paranccsal elindíthatja a fejlesztői webkiszolgálót.

<h3>Buildelés</h3>

Először készitsen egy másolatot a `src/environments/environment.ts` fájlból `src/environments/environment.prod.ts` néven, majd módosítsa az `API_URL` és `WS_URL` értékét a tényleges domain címre.

Utána a `ng build --localize` parancs segítségével lefordíthatja a projektet, ez létrehozza a `dist` könyvtárban a buildelt fájlokat. A --localize flag biztosítja, hogy a magyar nyelvű fordítás is elkészüljön.

A buildelt fájlokat egy tetszőleges webszerverre helyezve futtatható a frontend alkalmazás.

<h3>Licenc</h3>

A szoftver kódja oktatási és tanulási célokra használható és módosítható.
Tilos azonban a kódot kereskedelmi célra felhasználni, terjeszteni vagy sajátjaként publikálni a szerző előzetes írásbeli engedélye nélkül.
