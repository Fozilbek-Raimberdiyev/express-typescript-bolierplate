# Express.js va TypeScript bilan Node.js ilovasi yaratish

## 1. Loyihani sozlash

Birinchi navbatda, yangi loyiha uchun papka yarating va u yerga o'ting:

```bash
mkdir express-typescript-app
cd express-typescript-app
```

Node.js loyihasini ishga tushiring:

```bash
npm init -y
```

## 2. Zarur paketlarni o'rnatish

Express.js va TypeScript paketlarini o'rnating:

```bash
# Asosiy paketlar
npm install express
npm install -D typescript @types/node @types/express ts-node nodemon

# TypeScript uchun tiplar (type definitions)
npm install -D @types/express
```

## 3. TypeScript konfiguratsiyasini yaratish

TypeScript konfiguratsiya faylini yarating:

```bash
npx tsc --init
```

`tsconfig.json` faylini quyidagicha tahrirlang:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## 4. Src papkasini yaratish va app.ts faylini yaratish

`src` papkasini yarating va unda asosiy fayl yarating:

```bash
mkdir src
touch src/app.ts
```

`app.ts` faylida oddiy Express ilovasini yozing:

```typescript
import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Asosiy yo'l (route)
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript serveri muvaffaqiyatli ishga tushdi!');
});

// API namuna yo'li
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Salom, dunyoi TypeScript!' });
});

// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`⚡️[server]: Server http://localhost:${port} portida ishga tushirildi`);
});
```

## 5. package.json faylini sozlash

`package.json` fayliga quyidagi skriptlarni qo'shing:

```json
{
  "name": "express-typescript-app",
  "version": "1.0.0",
  "description": "Express.js va TypeScript bilan yaratilgan Node.js ilovasi",
  "main": "dist/app.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "nodemon src/app.ts"
  },
  "keywords": ["express", "typescript", "nodejs"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^18.15.11",
    "nodemon": "^2.0.22",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.4"
  }
}
```

## 6. Nodemon konfiguratsiyasini yaratish

`nodemon.json` faylini yarating:

```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node ./src/app.ts"
}
```

## 7. Ilovani ishga tushirish

Ilovani dev rejimida ishga tushirish:

```bash
npm run dev
```

Ilovani ishlab chiqarish (production) uchun kompilyatsiya qilish va ishga tushirish:

```bash
npm run build
npm start
```

## 8. Kengaytirilgan loyiha strukturasi

Katta loyihalar uchun quyidagi struktura tavsiya etiladi:

```
express-typescript-app/
├── src/
│   ├── controllers/    # Yo'llarni boshqarish logikasi
│   ├── middleware/     # Middleware funksiyalari
│   ├── models/         # Ma'lumotlar modellari
│   ├── routes/         # Yo'llar (routes)
│   ├── services/       # Biznes logikasi
│   ├── utils/          # Yordamchi funksiyalar
│   ├── types/          # TypeScript tipi definitsiyalari
│   └── app.ts          # Asosiy ilova fayli
├── dist/               # Kompilyatsiya qilingan JavaScript kodlari
├── node_modules/
├── .gitignore
├── nodemon.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

## 9. Yo'llarni va kontrollerlarni ajratib chiqish misolida

### `src/routes/index.ts`:

```typescript
import express from 'express';
import userRoutes from './user.routes';

const router = express.Router();

router.use('/users', userRoutes);

export default router;
```

### `src/routes/user.routes.ts`:

```typescript
import express from 'express';
import { getUsers, getUserById, createUser } from '../controllers/user.controller';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);

export default router;
```

### `src/controllers/user.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { User } from '../types/user';

// Ma'lumotlar bazasi o'rniga shunchaki foydalanuvchilar massivi
const users: User[] = [
  { id: 1, name: 'Alisher', email: 'alisher@example.com' },
  { id: 2, name: 'Gulnora', email: 'gulnora@example.com' }
];

export const getUsers = (req: Request, res: Response) => {
  res.json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
  }
  
  res.json(user);
};

export const createUser = (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Ism va email talab qilinadi' });
  }
  
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser: User = { id: newId, name, email };
  
  users.push(newUser);
  
  res.status(201).json(newUser);
};
```

### `src/types/user.ts`:

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### Yangilangan `src/app.ts`:

```typescript
import express, { Express } from 'express';
import routes from './routes';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Asosiy yo'l
app.get('/', (req, res) => {
  res.send('Express + TypeScript serveri muvaffaqiyatli ishga tushdi!');
});

// API yo'llarini ulash
app.use('/api', routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server http://localhost:${port} portida ishga tushirildi`);
});
```