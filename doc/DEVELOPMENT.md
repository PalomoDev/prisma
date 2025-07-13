# Руководство разработчика

## 🚀 Начало работы

### Предварительные требования
- **Node.js** 18.x или выше
- **npm** или **yarn**
- **PostgreSQL** 14.x или выше
- **Git**

### Первичная настройка

1. **Клонирование репозитория**
```bash
git clone [repository-url]
cd neon-debug-app
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка переменных окружения**
Создайте файл `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/neon_debug"
AUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Настройка базы данных**
```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

5. **Запуск проекта**
```bash
npm run dev
```

## 📁 Структура проекта для разработчиков

### Основные директории
```
├── app/                    # Next.js App Router
├── components/            # React компоненты
├── lib/                   # Бизнес-логика
├── types/                 # TypeScript типы
├── prisma/                # Prisma схема и миграции
├── public/                # Статические файлы
└── doc/                   # Документация
```

### Соглашения по именованию

#### Файлы и папки
- **Компоненты**: `PascalCase.tsx` (например, `ProductCard.tsx`)
- **Страницы**: `page.tsx`, `layout.tsx`
- **Утилиты**: `kebab-case.ts` (например, `format-price.ts`)
- **Actions**: `entity.actions.ts` (например, `product.actions.ts`)
- **Типы**: `entity.types.ts` (например, `product.types.ts`)

#### Переменные и функции
- **Переменные**: `camelCase`
- **Константы**: `SCREAMING_SNAKE_CASE`
- **Функции**: `camelCase`
- **Компоненты**: `PascalCase`

## 🔧 Основные паттерны разработки

### Server Actions

#### Создание нового action
```typescript
// lib/actions/example.actions.ts
"use server"

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

export async function createExample(data: CreateExampleInput) {
  try {
    // Валидация данных
    const validatedData = createExampleSchema.parse(data);
    
    // Бизнес-логика
    const example = await prisma.example.create({
      data: validatedData
    });
    
    // Обновление кэша
    revalidatePath('/admin/examples');
    
    return {
      success: true,
      data: example,
      message: 'Example created successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error)
    };
  }
}
```

### Компоненты

#### Серверный компонент
```typescript
// components/ExampleList.tsx
import { getExamples } from "@/lib/actions/example.actions";

export default async function ExampleList() {
  const examples = await getExamples();
  
  if (!examples.success) {
    return <div>Error: {examples.message}</div>;
  }
  
  return (
    <div>
      {examples.data?.map(example => (
        <div key={example.id}>{example.name}</div>
      ))}
    </div>
  );
}
```

#### Клиентский компонент
```typescript
// components/ExampleForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createExample } from '@/lib/actions/example.actions';

export default function ExampleForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    const result = await createExample(formData);
    
    if (result.success) {
      router.push('/admin/examples');
    } else {
      // Обработка ошибки
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <form action={handleSubmit}>
      {/* Форма */}
    </form>
  );
}
```

### Валидация с Zod

#### Создание схемы
```typescript
// lib/validations/example.validation.ts
import { z } from 'zod';

export const createExampleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateExampleInput = z.infer<typeof createExampleSchema>;
```

#### Использование в action
```typescript
export async function createExample(data: CreateExampleInput) {
  try {
    const validatedData = createExampleSchema.parse(data);
    // Остальная логика
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.errors
      };
    }
    throw error;
  }
}
```

## 🗃️ Работа с базой данных

### Создание новой модели

1. **Обновите схему Prisma**
```prisma
// prisma/schema.prisma
model Example {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  
  @@map("examples")
}
```

2. **Создайте миграцию**
```bash
npx prisma migrate dev --name add_example_model
```

3. **Обновите клиент**
```bash
npx prisma generate
```

### Лучшие практики запросов

#### Используйте include осторожно
```typescript
// ❌ Плохо - загружает все связи
const product = await prisma.product.findMany({
  include: {
    category: true,
    brand: true,
    specificationValues: {
      include: { specification: true }
    }
  }
});

// ✅ Хорошо - только необходимые поля
const product = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    category: { select: { name: true } }
  }
});
```

#### Используйте транзакции для связанных операций
```typescript
const result = await prisma.$transaction(async (tx) => {
  const product = await tx.product.create({ data: productData });
  
  await tx.productSubcategory.createMany({
    data: subcategoryIds.map(id => ({
      productId: product.id,
      subcategoryId: id
    }))
  });
  
  return product;
});
```

## 🎨 Стилизация

### Tailwind CSS

#### Основные классы проекта
```css
/* Обычные классы */
.wrapper { @apply max-w-7xl mx-auto px-4 }
.main-wrapper { @apply wrapper py-8 }
.flex-between { @apply flex items-center justify-between }
.h1-bold { @apply text-3xl font-bold }
.h2-bold { @apply text-2xl font-bold }
```

#### Создание компонента с вариантами
```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
```

## 🔐 Безопасность

### Аутентификация

#### Проверка прав в компоненте
```typescript
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  // Админский контент
}
```

#### Защита Server Actions
```typescript
import { requireAdmin } from '@/lib/auth-guard';

export async function deleteProduct(id: string) {
  // Проверка прав администратора
  await requireAdmin();
  
  // Логика удаления
}
```

### Валидация данных

#### Всегда валидируйте входные данные
```typescript
export async function updateProduct(id: string, data: unknown) {
  try {
    // Валидация ID
    const validId = z.string().uuid().parse(id);
    
    // Валидация данных
    const validData = updateProductSchema.parse(data);
    
    // Бизнес-логика
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}
```

## 🧪 Тестирование

### Настройка тестов

#### Jest конфигурация
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
```

#### Тестирование Server Actions
```typescript
// __tests__/actions/product.test.ts
import { createProduct } from '@/lib/actions/product.actions';

describe('Product Actions', () => {
  it('should create a product', async () => {
    const productData = {
      name: 'Test Product',
      slug: 'test-product',
      // ... другие поля
    };
    
    const result = await createProduct(productData);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
```

#### Тестирование компонентов
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

describe('ProductCard', () => {
  it('renders product information', () => {
    const product = {
      id: '1',
      name: 'Test Product',
      price: '99.99',
    };
    
    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });
});
```

## 📊 Отладка

### Логирование

#### Использование console.log
```typescript
export async function createProduct(data: InsertProductSchema) {
  console.log('🔍 Creating product:', data);
  
  try {
    const result = await prisma.product.create({ data });
    console.log('✅ Product created:', result.id);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Product creation failed:', error);
    return { success: false, error: formatError(error) };
  }
}
```

#### Structured logging
```typescript
const logger = {
  info: (message: string, data?: any) => {
    console.log(`ℹ️  ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error);
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 ${message}`, data);
    }
  }
};
```

### Отладка в браузере

#### React DevTools
- Установите React DevTools extension
- Используйте для отладки компонентов и состояния

#### Network tab
- Отслеживайте Server Actions в Network tab
- Проверяйте запросы и ответы

## 🚀 Оптимизация производительности

### Серверные компоненты

#### Параллельные запросы
```typescript
export default async function ProductPage({ params }: { params: { id: string } }) {
  // ✅ Параллельные запросы
  const [product, relatedProducts] = await Promise.all([
    getProductById(params.id),
    getRelatedProducts(params.id)
  ]);
  
  return (
    <div>
      <ProductDetails product={product} />
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
```

#### Streaming с Suspense
```typescript
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}
```

### Оптимизация изображений

#### Next.js Image компонент
```typescript
import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={200}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover rounded-lg"
      priority={false} // true только для above-the-fold изображений
    />
  );
}
```

## 🔄 Continuous Integration

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build project
        run: npm run build
```

## 📝 Код-ревью

### Чек-лист для ревью

#### Общие принципы
- [ ] Код соответствует соглашениям проекта
- [ ] Добавлены необходимые типы TypeScript
- [ ] Обработаны все возможные ошибки
- [ ] Добавлены комментарии для сложной логики

#### Server Actions
- [ ] Используется правильный формат ответа
- [ ] Валидация входных данных с Zod
- [ ] Проверка прав доступа
- [ ] Обновление кэша с revalidatePath

#### Компоненты
- [ ] Правильное использование Server/Client компонентов
- [ ] Оптимизация производительности
- [ ] Accessibility (a11y) соображения
- [ ] Responsive design

## 🐛 Частые проблемы и решения

### Hydration errors
```typescript
// ❌ Проблема - разное содержимое на сервере и клиенте
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;

// ✅ Решение - условный рендеринг
```

### Prisma типы
```typescript
// ❌ Проблема - использование Prisma типов в клиенте
import { Product } from '@prisma/client';

// ✅ Решение - собственные типы
export interface ProductForClient {
  id: string;
  name: string;
  price: string;
}
```

### Server Actions ошибки
```typescript
// ❌ Проблема - неправильная обработка ошибок
export async function createProduct(data: any) {
  const product = await prisma.product.create({ data });
  return product;
}

// ✅ Решение - обработка ошибок
export async function createProduct(data: CreateProductInput) {
  try {
    const validatedData = createProductSchema.parse(data);
    const product = await prisma.product.create({ data: validatedData });
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}
``` 