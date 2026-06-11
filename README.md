# Pocket Logistics Assistant - Backend

Backend NestJS de l'application **Pocket Logistics Assistant**, un assistant de gestion logistique pour suivre des utilisateurs, voyages, articles, colis, frais et taux de change.

Le projet expose actuellement une base API fonctionnelle avec authentification JWT, gestion des utilisateurs et schema Prisma pret pour les modules metier logistiques.

## Etat actuel

- Authentification: inscription, connexion, profil connecte.
- Autorisation: garde JWT disponible, garde par roles prepare.
- Utilisateurs: liste des utilisateurs protegee par token.
- Base de donnees: PostgreSQL avec Prisma.
- Mode developpement: fallback local `dev_users.json` si la base PostgreSQL est inaccessible.
- Modelisation metier deja presente dans Prisma: users, trips, categories, items, parcels, parcel_items, expenses, exchange_rates.

Les endpoints metier pour les voyages, colis, articles, frais et taux de change sont maintenant implementes.

## Stack technique

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Passport JWT
- bcryptjs
- Jest / Supertest
- Docker Compose

## Prerequis

- Node.js installe
- npm installe
- Docker Desktop, pour lancer PostgreSQL et pgAdmin

## Installation

```bash
npm install
```

## Configuration

Creer un fichier `.env` a la racine du projet avec les variables suivantes:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=pocket_logistics
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/pocket_logistics?schema=public
JWT_SECRET=change_me_in_dev
JWT_EXPIRATION=1d
PORT=3000
```

Ne pas utiliser la valeur `change_me_in_dev` en production.

## Base de donnees

Lancer PostgreSQL et pgAdmin:

```bash
docker compose up -d
```

Services disponibles:

- PostgreSQL: `localhost:5433`
- pgAdmin: `http://localhost:5050`
- pgAdmin email: `admin@admin.com`
- pgAdmin password: `admin`

Appliquer les migrations Prisma:

```bash
npx prisma migrate dev
```

Generer le client Prisma:

```bash
npx prisma generate
```

## Lancement

Mode developpement:

```bash
npm run start:dev
```

Mode classique:

```bash
npm run start
```

Build production:

```bash
npm run build
```

Lancement apres build:

```bash
npm run start:prod
```

Par defaut, l'API ecoute sur:

```text
http://localhost:3001
```

La variable `PORT` permet de changer ce port.

## Routes API disponibles

### Health / accueil

```http
GET /
```

Retourne un message de verification du backend.

### Inscription

```http
POST /auth/register
Content-Type: application/json
```

Body:

```json
{
  "name": "Marcel",
  "email": "marcel@example.com",
  "password": "secret123"
}
```

Le mot de passe doit contenir au moins 6 caracteres.

### Connexion

```http
POST /auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "marcel@example.com",
  "password": "secret123"
}
```

Retourne un `accessToken` JWT et les informations publiques de l'utilisateur.

### Profil connecte

```http
GET /auth/me
Authorization: Bearer <accessToken>
```

Retourne le profil public de l'utilisateur connecte.

### Liste des utilisateurs

```http
GET /users
Authorization: Bearer <accessToken>
```

Retourne la liste des utilisateurs sans les mots de passe.

### Articles (items)

```http
GET /items
Authorization: Bearer <accessToken>
```

```http
POST /items
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```json
{
  "name": "Article 1",
  "unit_price": 100.0,
  "currency": "XOF",
  "exchange_rate_at_purchase": 650.0,
  "category_id": 1,
  "quantity": 5,
  "trip_id": 1
}
```

```http
GET /items/:id
Authorization: Bearer <accessToken>
```

```http
PATCH /items/:id
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```http
DELETE /items/:id
Authorization: Bearer <accessToken>
```

### Colis (parcels)

```http
GET /parcels
Authorization: Bearer <accessToken>
```

```http
POST /parcels
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```json
{
  "tracking_code": "COLIS-123",
  "origin": "Ouagadougou",
  "destination": "Abidjan",
  "notes": "Livraison prioritaire",
  "trip_id": 1
}
```

```http
GET /parcels/:id
Authorization: Bearer <accessToken>
```

```http
PATCH /parcels/:id
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```http
DELETE /parcels/:id
Authorization: Bearer <accessToken>
```

### Articles dans un colis

```http
GET /parcels/:id/items
Authorization: Bearer <accessToken>
```

```http
POST /parcels/:id/items
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```json
{
  "item_id": 1,
  "quantity_assigned": 2,
  "landed_cost": 250.0
}
```

```http
PATCH /parcels/:id/items/:itemId
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```http
DELETE /parcels/:id/items/:itemId
Authorization: Bearer <accessToken>
```

### Frais (expenses)

```http
GET /expenses
Authorization: Bearer <accessToken>
```

```http
POST /expenses
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```json
{
  "amount_cfa": 1500.0,
  "expense_type": "Transport",
  "description": "Frais douane",
  "trip_id": 1,
  "parcel_id": 1
}
```

```http
GET /expenses/:id
Authorization: Bearer <accessToken>
```

```http
PATCH /expenses/:id
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```http
DELETE /expenses/:id
Authorization: Bearer <accessToken>
```

### Taux de change (exchange-rates)

```http
GET /exchange-rates
Authorization: Bearer <accessToken>
```

```http
POST /exchange-rates
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```json
{
  "from_currency": "XOF",
  "to_currency": "USD",
  "rate": 0.0016
}
```

```http
GET /exchange-rates/:id
Authorization: Bearer <accessToken>
```

```http
PATCH /exchange-rates/:id
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```http
DELETE /exchange-rates/:id
Authorization: Bearer <accessToken>
```

## Structure du projet

```text
src/
  auth/       Authentification, DTO, JWT, guards, decorators
  prisma/     Module Prisma et service de connexion DB
  users/      Gestion des utilisateurs
  app.*       Module, controleur et service racine
prisma/
  schema.prisma
  migrations/
test/
  app.e2e-spec.ts
```

## Tests et verification

Tests unitaires:

```bash
npm test
```

Tests end-to-end:

```bash
npm run test:e2e
```

Compilation:

```bash
npm run build
```

Formatage:

```bash
npm run format
```

Lint:

```bash
npm run lint
```

## Notes de developpement

- Les requetes entrantes passent par un `ValidationPipe` global avec `whitelist`, `forbidNonWhitelisted` et `transform`.
- Les mots de passe sont hashes avec `bcryptjs`.
- Les tokens JWT contiennent `id`, `email` et `role`.
- Le service users peut basculer vers `dev_users.json` en developpement si Prisma/PostgreSQL n'est pas disponible.
- Ce fallback fichier est utile pour avancer localement, mais ne doit pas remplacer PostgreSQL pour une version de production.

## Prochaines etapes recommandees

- Ajouter les modules `trips`, `items`, `parcels`, `expenses` et `exchange-rates`.
- Proteger les routes sensibles avec `RolesGuard`.
- Ajouter des tests sur `auth` et `users`.
- Documenter l'API avec Swagger/OpenAPI.
- Ajouter des seeds Prisma pour initialiser des donnees de demo.
