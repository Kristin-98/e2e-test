# 🌤️ Väderapp React

## Beskrivning
Detta är en väderapplikation byggd med Next.js och TypeScript som låter användare:

- Söka efter väder i olika städer.
- Spara favoritstäder i en databas.
- Välja aktiviteter baserat på väderförhållanden.
- Se tidigare sparade favoriter direkt vid sidladdning.

Appen använder ett REST-API för att hämta väderdata och sparade favoriter. MongoDB används som databas för att lagra favoritstäder, och Prisma används som ORM för att kommunicera med databasen. Tailwind används för css.

---

## Bygga projektet

Installera beroenden:

```bash
npm install
# eller
yarn install

## Bygga projektet för produktion
npm run build
# eller
yarn build

## Starta utvecklingsservern
npm run dev
# eller
yarn dev

##Miljövariabler

##Skapa en .env-fil i projektets rot och lägg till följande variabler:
MONGODB_URI=<din_mongodb_connection_string>
##Prisma kommer att använda detta för att koppla upp mot MongoDB.

##Testa projektet:
##Projektet använder Cypress för end-to-end tester.
##Installera Cypress (om inte redan installerat):

npm install cypress --save-dev
# eller
yarn add cypress --dev

##Öppna Cypress testgränssnitt:
npm run test

##Prisma & Databas:
##Initiera Prisma och skapa databasen:
npm run push

##Kör Prisma Studio för att inspektera databasen:
npm run studio