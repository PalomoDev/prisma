# Архитектура проекта

## 🏗️ Общая архитектура

Проект построен на основе **Next.js 15 App Router** с использованием серверных компонентов и Server Actions для оптимальной производительности.

### Основные принципы
- **Server-First**: Максимальное использование серверных компонентов
- **Type Safety**: Полная типизация с TypeScript и Zod
- **Модульность**: Разделение ответственности между слоями
- **Производительность**: Оптимизация запросов и кэширование

## 📂 Структура папок

### App Router (`app/`)
```
app/
├── (auth)/                 # Группа маршрутов аутентификации
│   ├── layout.tsx         # Layout для страниц входа/регистрации
│   ├── login/             # Страница входа
│   └── sign-up/           # Страница регистрации
├── (root)/                # Основные пользовательские страницы
│   ├── layout.tsx         # Основной layout с хедером и футером
│   ├── page.tsx           # Главная страница
│   ├── products/          # Каталог товаров
│   ├── product/[slug]/    # Детальная страница товара
│   ├── cart/              # Корзина
│   ├── shipping-address/  # Адрес доставки
│   └── shipping-method/   # Способ доставки
├── admin/                 # Административная панель
│   ├── layout.tsx         # Layout для админки
│   ├── page.tsx           # Главная страница админки
│   ├── products/          # Управление товарами
│   └── users/             # Управление пользователями
└── api/                   # API маршруты
    ├── auth/              # NextAuth.js эндпоинты
    └── uploadthing/       # Загрузка файлов
```

### Компоненты (`components/`)
```
components/
├── admin/                 # Компоненты админской панели
│   ├── forms/            # Формы для CRUD операций
│   └── tables/           # Таблицы с данными
├── shared/               # Общие компоненты
│   ├── layout/           # Компоненты layout (header, footer)
│   ├── product/          # Компоненты товаров
│   └── delete-dialog.tsx # Общие UI компоненты
└── ui/                   # Базовые UI компоненты (Shadcn)
    ├── button.tsx
    ├── input.tsx
    └── ...
```

### Бизнес-логика (`lib/`)
```
lib/
├── actions/              # Server Actions
│   ├── auth.actions.ts   # Аутентификация
│   ├── product.actions.ts # Работа с товарами
│   ├── cart.actions.ts   # Корзина
│   └── category.actions.ts # Категории
├── validations/          # Zod схемы валидации
│   ├── product.validation.ts
│   ├── cart.validation.ts
│   └── user.validation.ts
├── utils/                # Утилиты
│   ├── prisma-serializer.ts # Сериализация Prisma объектов
│   └── count-cart-items.ts
├── constants.tsx         # Константы приложения
├── auth-guard.ts         # Защита маршрутов
└── utils.ts              # Общие утилиты
```

## 🔄 Слои архитектуры

### 1. Presentation Layer (Слой представления)
- **React Server Components** - для статического контента
- **Client Components** - для интерактивности
- **Layouts** - общие обертки для групп страниц

### 2. Application Layer (Слой приложения)
- **Server Actions** - серверная бизнес-логика
- **Middleware** - обработка запросов
- **Route Handlers** - API эндпоинты

### 3. Domain Layer (Доменный слой)
- **Zod Schemas** - валидация и типизация
- **TypeScript Types** - интерфейсы и типы
- **Business Logic** - правила предметной области

### 4. Infrastructure Layer (Инфраструктурный слой)
- **Prisma ORM** - доступ к данным
- **PostgreSQL** - база данных
- **NextAuth.js** - аутентификация
- **UploadThing** - загрузка файлов

## 📊 Модели данных

### Иерархия товаров
```
Brand (Бренд)
└── Product (Товар)
    ├── Category (Категория)
    ├── ProductSubcategory (Подкатегории) [Many-to-Many]
    ├── ProductSpecificationValue (Спецификации)
    └── ProductFeature (Особенности) [Many-to-Many]
```

### Система спецификаций
```
Specification (Спецификация)
├── CategorySpecification (Привязка к категории)
└── ProductSpecificationValue (Значения у товаров)
```

### Система пользователей
```
User (Пользователь)
├── Account (Аккаунты соц.сетей)
├── Session (Сессии)
├── Cart (Корзина)
├── Order (Заказы)
└── Review (Отзывы)
```

## 🔐 Система безопасности

### Аутентификация
- **NextAuth.js** с Credentials провайдером
- **JWT стратегия** с 30-дневным сроком жизни
- **Хеширование паролей** с bcrypt

### Авторизация
- **Role-based access control** (user, admin)
- **Middleware** для защиты маршрутов
- **Server Actions** с проверкой прав

### Валидация
- **Zod схемы** на всех уровнях
- **Server-side validation** в Server Actions
- **Client-side validation** в формах

## 🚀 Производительность

### Серверные компоненты
- **RSC** для статического контента
- **Streaming** для прогрессивной загрузки
- **Параллельные запросы** к базе данных

### Кэширование
- **Next.js автоматическое кэширование**
- **Prisma connection pooling**
- **Static generation** для статичных страниц

### Оптимизация изображений
- **Next.js Image** компонент
- **Responsive images** с srcset
- **Lazy loading** по умолчанию

## 🔧 Паттерны проектирования

### Server Actions Pattern
```typescript
// Единый формат ответа
interface ActionResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Обработка ошибок
try {
  const result = await someAction();
  return { success: true, data: result };
} catch (error) {
  return { success: false, error: formatError(error) };
}
```

### Repository Pattern
```typescript
// Абстракция доступа к данным через Prisma
const product = await prisma.product.findUnique({
  where: { id },
  include: {
    category: true,
    brand: true,
    specificationValues: {
      include: { specification: true }
    }
  }
});
```

### Validation Pattern
```typescript
// Zod схемы для валидации
const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{2})?$/),
  categoryId: z.string().uuid(),
});

// Использование в Server Actions
const validatedData = createProductSchema.parse(data);
```

## 📱 Адаптивность

### Responsive Design
- **Mobile-first** подход
- **Tailwind CSS** брейкпоинты
- **Flexbox/Grid** для layout

### Компоненты
- **Условный рендеринг** для разных устройств
- **Адаптивные размеры** изображений
- **Мобильная навигация**

## 🧪 Тестирование

### Стратегия тестирования
- **Unit тесты** для утилит
- **Integration тесты** для Server Actions
- **E2E тесты** для критичных пользовательских сценариев

### Инструменты
- **Jest** для unit тестов
- **React Testing Library** для компонентов
- **Playwright** для E2E тестирования

## 🔄 Развитие архитектуры

### Ближайшие улучшения
1. **Микросервисная архитектура** для масштабирования
2. **Event-driven architecture** для асинхронных операций
3. **CQRS pattern** для разделения чтения/записи
4. **Redis** для кэширования и сессий

### Потенциальные рефакторинги
1. **Выделение бизнес-логики** в отдельные сервисы
2. **GraphQL** для более гибкого API
3. **Монорепозиторий** для frontend/backend разделения 