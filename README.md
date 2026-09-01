# 📚 Financial Management — Documentación de API

> Base URL (producción): `https://tu-app.onrender.com`
> Base URL (local): `http://localhost:3000`
> Documentación interactiva (Swagger): `/`
>
> Para rutas protegidas, agregar en los headers:
> `Authorization: Bearer <accessToken>`

---

## ⚠️ Notas importantes

- Las rutas marcadas con 🔒 requieren `accessToken` JWT en el header.
- Los ids tienen formato UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.
- El `accessToken` expira a los 15 minutos — usar `POST /auth/refresh` para renovarlo.

---

---

## 🛠️ Instalación y ejecución en local

### 1. Clonar y preparar el proyecto

```bash
git clone https://github.com/JuanMoraP/financialManagement.git
cd financialManagement
npm install
```

### 2. Configurar la base de datos — dos opciones

**Opción A — Conectarse directo a Supabase (la más simple, recomendada para empezar)**

No requiere instalar Postgres en tu máquina. Solo necesitas la connection string de tu proyecto de Supabase (Dashboard → Settings → Database → Connection string), y pegarla en `DATABASE_URL` dentro de tu `.env.development`.

```env
DATABASE_URL=postgresql://usuario:password@host-de-supabase:5432/postgres
```

> Ventaja: mismos datos que usas siempre, sin duplicar nada. Desventaja: necesitas conexión a internet para desarrollar.

**Opción B — PostgreSQL local (para trabajar sin conexión a internet)**

Requiere tener Postgres corriendo en tu propia máquina — dos formas de lograrlo:

- **Con Docker** (recomendada si ya tienes Docker instalado): usar el `docker-compose.yaml` de este proyecto para levantar un Postgres local con un solo comando — ver la Guía Práctica de Docker, Parte 8, para el archivo completo.
  ```bash
  docker compose up -d postgres-db
  ```
- **Instalación nativa**: instalar PostgreSQL directamente en tu sistema operativo (postgresql.org/download), crear una base de datos vacía, y usar sus credenciales locales.

En cualquiera de los dos casos, tu `DATABASE_URL` en `.env.development` apunta a `localhost`:
```env
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/financial_management
```

> Diferencia clave: la base de datos de Supabase y una de Postgres local son dos bases de datos **completamente separadas** — no comparten datos entre sí. Si usas la Opción B, empiezas con una base de datos vacía y tienes que correr las migraciones ahí (ver paso 4) para crear las tablas.

### 3. Variables de entorno

Copia `.env.example` a `.env.development` y completa los valores:
```bash
cp .env.example .env.development
```
Necesitas como mínimo: `DATABASE_URL` (paso 2), `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` (genera cada uno con `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`).

### 4. Correr las migraciones

```bash
NODE_ENV=development npm run migration:run
```
> Necesario siempre que uses una base de datos nueva y vacía (Opción B) — si usas Supabase (Opción A) con datos ya existentes, probablemente ya estén aplicadas.

### 5. Levantar el proyecto

```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000`, y la documentación interactiva de Swagger en `http://localhost:3000/`.

## 🔐 AUTH

### POST `/auth/signup`

**Acceso:** Público

**Body:**
```json
{
  "name": "Ana García",
  "age": 28,
  "email": "ana.garcia@email.com",
  "password": "Pass123!$",
  "confirmPassword": "Pass123!$",
  "birthdate": "1996-05-14",
  "country": "Colombia",
  "phone": "3001234567"
}
```
> La contraseña debe tener entre 8 y 15 caracteres, con al menos una mayúscula, una minúscula, un número y un símbolo (`!@#$%^&*`).

---

### POST `/auth/login`

**Acceso:** Público

**Body:**
```json
{
  "email": "ana.garcia@email.com",
  "password": "Pass123!$"
}
```

**Respuesta:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### POST `/auth/refresh`

Renueva el `accessToken`. Rota el `refreshToken` (el anterior queda inválido).

**Acceso:** Público (requiere `refreshToken` válido)

**Body:**
```json
{ "refreshToken": "eyJhbGc..." }
```

---

### POST `/auth/logout` 🔒

Invalida el `refreshToken` guardado del usuario.

**Body:** No requiere.

---

## 👤 USERS

### GET `/users/get-all-users` 🔒

Obtener todos los usuarios.

---

### GET `/users/email/:email` 🔒

**Params:** `email` (string)

---

### GET `/users/:id` 🔒

**Params:** `id` (UUID)

---

### PATCH `/users/update-user` 🔒

Actualizar los datos del usuario autenticado (no incluye contraseña).

**Body:** Campos opcionales, según `UpdateUserDto`.

---

### PATCH `/users/update-password` 🔒

**Body:**
```json
{
  "currentPassword": "Pass123!$",
  "newPassword": "NewPass456!$",
  "confirmPassword": "NewPass456!$"
}
```
> `newPassword` y `confirmPassword` deben cumplir los mismos requisitos de complejidad que la contraseña de registro.

---

### PATCH `/users/inactive-user` 🔒

Desactiva la cuenta del usuario autenticado. **Body:** No requiere.

---

## 🗂️ CATEGORIES

### GET `/categories/get-all-categories`

Categorías por defecto (globales). **Acceso:** Público

---

### GET `/categories/get-my-categories/:id`

Categorías del usuario (por defecto + propias).

**Params:** `id` (UUID del usuario)

---

### POST `/categories/create-categorie` 🔒

**Body:**
```json
{ "name": "Mascotas" }
```

---

### PATCH `/categories/updateCategory/:id` 🔒

**Params:** `id` (UUID de la categoría)

**Body:**
```json
{ "name": "Nuevo nombre" }
```

---

### DELETE `/categories/delete-category/:id` 🔒

**Params:** `id` (UUID de la categoría)

---

## 💰 FINANCIAL PROFILE

### GET `/financial-profile/my-financial-pro` 🔒

---

### PATCH `/financial-profile/update-financial-profile` 🔒

**Body:** Todos los campos opcionales.
```json
{
  "initialAmount": 2500,
  "currentAmount": 3200,
  "currentIncome": 4800,
  "currentSpent": 2100,
  "monthlySavingsGoal": 500,
  "currency": "COP",
  "preferredBank": "Banco de Bogotá"
}
```

---

## 💸 TRANSACTIONS

### POST `/transaction/create-transaction` 🔒

**Body:**
```json
{
  "description": "Pago de supermercado",
  "transactionType": "outgoing",
  "amount": 125.50,
  "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
> `transactionType`: `"incoming"` o `"outgoing"`.

---

### GET `/transaction/:id` 🔒

**Params:** `id` (UUID)

---

### GET `/transaction/category/:categoryId` 🔒

Transacciones de una categoría específica.

**Params:** `categoryId` (UUID)

---

### GET `/transaction/allTransactions` 🔒

**Query params:**
| Param | Tipo | Descripción |
|---|---|---|
| date | string (fecha) | Filtrar por fecha |
| transactionType | string | `"incoming"` o `"outgoing"` |
| category | UUID | Filtrar por categoría |
| page | number | Página (default: 1) |
| limit | number | Resultados por página (máx: 10) |

---

### DELETE `/transaction/delete-transaction/:id` 🔒

Soft delete — revierte el efecto sobre el balance del perfil.

**Params:** `id` (UUID)

---

### POST `/transaction/update-transaction/:id` 🔒

Actualizar una transacción existente.

**Params:** `id` (UUID)

**Body:**
```json
{
  "description": "Pago de supermercado",
  "transactionType": "outgoing",
  "amount": 130.00,
  "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

---

## 🚧 Próximamente

- Reportes: gasto mensual, balance ingresos vs. gastos.
