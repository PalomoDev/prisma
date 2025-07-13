# База данных

## 📊 Обзор

Проект использует **PostgreSQL** в качестве основной базы данных с **Prisma ORM** для управления схемой и запросами.

## 🗂️ Структура базы данных

### Основные группы таблиц

1. **Товары и каталог** - products, categories, brands, etc.
2. **Спецификации** - modular system для характеристик товаров
3. **Пользователи и аутентификация** - users, sessions, accounts
4. **Корзина и заказы** - cart, orders, order_items
5. **Отзывы** - reviews

## 📦 Модели товаров

### categories (Категории)
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                 -- "Палатки", "Спальные мешки"
    slug TEXT UNIQUE NOT NULL,          -- "palatki", "spalnie-meshki"
    description TEXT,                   -- Описание категории
    image TEXT,                         -- Изображение для отображения
    is_active BOOLEAN DEFAULT true,     -- Активна ли категория
    sort_order INTEGER DEFAULT 0,      -- Порядок сортировки
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL
);
```

### subcategories (Подкатегории)
```sql
CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                 -- "2-местные", "Экспедиционные"
    slug TEXT UNIQUE NOT NULL,          -- Глобально уникальный slug
    description TEXT,                   -- Описание подкатегории
    image TEXT,                         -- Изображение подкатегории
    is_active BOOLEAN DEFAULT true,     -- Активна ли подкатегория
    sort_order INTEGER DEFAULT 0,      -- Порядок сортировки
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL
);
```

### category_subcategories (Связь категорий и подкатегорий)
```sql
CREATE TABLE category_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    subcategory_id UUID NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,      -- Порядок в конкретной категории
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL,
    UNIQUE(category_id, subcategory_id)
);
```

### brands (Бренды)
```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,          -- "Coleman", "The North Face"
    slug TEXT UNIQUE NOT NULL,          -- "coleman", "the-north-face"
    description TEXT,                   -- Описание бренда
    logo TEXT,                          -- Логотип бренда
    website TEXT,                       -- Сайт бренда
    is_active BOOLEAN DEFAULT true,     -- Активен ли бренд
    sort_order INTEGER DEFAULT 0,      -- Порядок сортировки
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL
);
```

### products (Товары)
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                 -- Название товара
    slug TEXT UNIQUE NOT NULL,          -- URL-friendly название
    sku TEXT UNIQUE NOT NULL,           -- Артикул товара
    category_id UUID NOT NULL REFERENCES categories(id),
    brand_id UUID NOT NULL REFERENCES brands(id),
    images TEXT[],                      -- Массив URL изображений
    description TEXT NOT NULL,          -- Описание товара
    stock INTEGER NOT NULL,             -- Количество на складе
    price DECIMAL(12,2) DEFAULT 0,      -- Цена
    rating DECIMAL(3,2) DEFAULT 0,      -- Рейтинг (0-5)
    num_reviews INTEGER DEFAULT 0,     -- Количество отзывов
    is_featured BOOLEAN DEFAULT false,  -- Рекомендуемый товар
    banner TEXT,                        -- Баннер для товара
    is_active BOOLEAN DEFAULT true,     -- Активен ли товар
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL
);
```

### product_subcategories (Связь товаров и подкатегорий)
```sql
CREATE TABLE product_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    subcategory_id UUID NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL,
    UNIQUE(product_id, subcategory_id)
);
```

## 🔧 Модульная система спецификаций

### specifications (Справочник спецификаций)
```sql
CREATE TABLE specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,          -- "Количество мест", "Температура"
    key TEXT UNIQUE NOT NULL,           -- "capacity", "temperature"
    description TEXT,                   -- Описание спецификации
    unit TEXT,                          -- "места", "°C", "кг"
    type TEXT NOT NULL,                 -- "number", "text", "select", "boolean"
    options TEXT[] DEFAULT '{}',        -- Варианты для select
    icon TEXT,                          -- Иконка для отображения
    category TEXT,                      -- Группировка спецификаций
    is_active BOOLEAN DEFAULT true,     -- Активна ли спецификация
    sort_order INTEGER DEFAULT 0,      -- Порядок сортировки
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL
);
```

### category_specifications (Спецификации для категорий)
```sql
CREATE TABLE category_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    specification_id UUID NOT NULL REFERENCES specifications(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT false,  -- Обязательная ли спецификация
    sort_order INTEGER DEFAULT 0,      -- Порядок в категории
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL,
    UNIQUE(category_id, specification_id)
);
```

### product_specification_values (Значения спецификаций у товаров)
```sql
CREATE TABLE product_specification_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    specification_id UUID NOT NULL REFERENCES specifications(id) ON DELETE CASCADE,
    value TEXT NOT NULL,                -- "4", "-10", "Полиэстер"
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL,
    UNIQUE(product_id, specification_id)
);
```

## ⭐ Система особенностей

### features (Особенности товаров)
```sql
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                 -- "Водостойкий", "Легкий"
    key TEXT UNIQUE NOT NULL,           -- "waterproof", "lightweight"
    icon TEXT NOT NULL,                 -- Имя иконки
    icon_image TEXT,                    -- Путь к файлу иконки
    description TEXT,                   -- Описание особенности
    category TEXT,                      -- Группировка особенностей
    color TEXT,                         -- Цвет иконки/бейджа
    is_active BOOLEAN DEFAULT true,     -- Активна ли особенность
    sort_order INTEGER DEFAULT 0,      -- Порядок отображения
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL
);
```

### product_features (Связь товаров и особенностей)
```sql
CREATE TABLE product_features (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, feature_id)
);
```

## 👥 Пользователи и аутентификация

### users (Пользователи)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT DEFAULT 'NO_NAME',       -- Имя пользователя
    email TEXT UNIQUE NOT NULL,        -- Email
    email_verified TIMESTAMP(6),       -- Подтверждение email
    image TEXT,                        -- Аватар пользователя
    password TEXT,                     -- Хеш пароля
    role TEXT DEFAULT 'user',          -- Роль: "user", "admin"
    address JSON,                      -- Адрес пользователя
    payment_method TEXT,               -- Предпочитаемый способ оплаты
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);
```

### accounts (Аккаунты соц.сетей)
```sql
CREATE TABLE accounts (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,                -- Тип аккаунта
    provider TEXT NOT NULL,            -- Провайдер (google, github, etc.)
    provider_account_id TEXT NOT NULL, -- ID в системе провайдера
    refresh_token TEXT,               -- Refresh token
    access_token TEXT,                -- Access token
    expires_at INTEGER,               -- Время истечения
    token_type TEXT,                  -- Тип токена
    scope TEXT,                       -- Области доступа
    id_token TEXT,                    -- ID token
    session_state TEXT,               -- Состояние сессии
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,
    PRIMARY KEY (provider, provider_account_id)
);
```

### sessions (Сессии)
```sql
CREATE TABLE sessions (
    session_token TEXT PRIMARY KEY,    -- Токен сессии
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP(6) NOT NULL,     -- Время истечения
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);
```

## 🛒 Корзина и заказы

### carts (Корзины)
```sql
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Может быть NULL для гостей
    session_cart_id TEXT NOT NULL,     -- ID сессии для гостевых корзин
    items JSON[] DEFAULT '{}',         -- Товары в корзине
    items_price DECIMAL(12,2),         -- Стоимость товаров
    total_price DECIMAL(12,2),         -- Общая стоимость
    shipping_price DECIMAL(12,2),      -- Стоимость доставки
    tax_price DECIMAL(12,2),           -- Налоги
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL
);
```

### orders (Заказы)
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shipping_address JSON NOT NULL,    -- Адрес доставки
    payment_method TEXT NOT NULL,      -- Способ оплаты
    payment_result JSON,               -- Результат платежа
    items_price DECIMAL(12,2),         -- Стоимость товаров
    shipping_price DECIMAL(12,2),      -- Стоимость доставки
    tax_price DECIMAL(12,2),           -- Налоги
    total_price DECIMAL(12,2),         -- Итоговая стоимость
    is_paid BOOLEAN DEFAULT false,     -- Оплачен ли заказ
    paid_at TIMESTAMP(6),              -- Дата оплаты
    is_delivered BOOLEAN DEFAULT false,-- Доставлен ли заказ
    delivered_at TIMESTAMP(6),         -- Дата доставки
    status TEXT DEFAULT 'pending',     -- Статус заказа
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL
);
```

### order_items (Позиции в заказе)
```sql
CREATE TABLE order_items (
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    qty INTEGER NOT NULL,              -- Количество
    price DECIMAL(12,2) NOT NULL,      -- Цена на момент заказа
    name TEXT NOT NULL,                -- Название на момент заказа
    slug TEXT NOT NULL,                -- Slug на момент заказа
    image TEXT NOT NULL,               -- Изображение на момент заказа
    PRIMARY KEY (order_id, product_id)
);
```

## 📝 Отзывы

### reviews (Отзывы)
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,           -- Оценка 1-5
    title TEXT NOT NULL,               -- Заголовок отзыва
    description TEXT NOT NULL,         -- Текст отзыва
    is_verified_purchase BOOLEAN DEFAULT true, -- Подтвержденная покупка
    is_approved BOOLEAN DEFAULT false, -- Одобрен ли отзыв
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL
);
```

## 🔍 Индексы

### Основные индексы
```sql
-- Категории
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- Товары
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_sku ON products(sku);

-- Спецификации
CREATE INDEX idx_specifications_active ON specifications(is_active);
CREATE INDEX idx_specifications_type ON specifications(type);
CREATE INDEX idx_product_spec_values_product ON product_specification_values(product_id);

-- Корзина
CREATE INDEX idx_carts_session ON carts(session_cart_id);

-- Заказы
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

## 🛠️ Команды Prisma

### Основные команды
```bash
# Генерация Prisma Client
npx prisma generate

# Создание миграции
npx prisma migrate dev --name migration_name

# Применение миграций
npx prisma migrate deploy

# Сброс базы данных
npx prisma migrate reset

# Просмотр базы данных
npx prisma studio

# Заполнение базы данных
npx prisma db seed
```

### Примеры запросов

#### Получение товара со всеми связями
```typescript
const product = await prisma.product.findUnique({
  where: { slug: 'tent-1' },
  include: {
    category: true,
    brand: true,
    productSubcategories: {
      include: {
        subcategory: true
      }
    },
    specificationValues: {
      include: {
        specification: true
      }
    },
    features: {
      include: {
        feature: true
      }
    }
  }
});
```

#### Получение товаров с фильтрацией
```typescript
const products = await prisma.product.findMany({
  where: {
    isActive: true,
    category: {
      slug: 'tents'
    },
    price: {
      gte: 100,
      lte: 500
    }
  },
  include: {
    category: true,
    brand: true
  },
  orderBy: {
    createdAt: 'desc'
  }
});
```

## 📊 Миграции

### История миграций
1. **20250501131208_init** - Начальная структура
2. **20250503102118_add_user_profile** - Добавление пользователей
3. **20250508085808_add_cart** - Добавление корзины
4. **20250508094539_add_all_model** - Полная структура
5. **20250618104533_add_many_to_many_categories** - Many-to-many связи
6. **20250624111351_add_brands_and_product_subcategories** - Бренды и подкатегории
7. **20250625075101_refactor_specifications_to_modular_system** - Модульные спецификации

## 🚀 Оптимизация

### Советы по производительности
1. **Индексы** - создавайте индексы для часто используемых полей
2. **Включения** - используйте `include` осторожно, только необходимые связи
3. **Пагинация** - всегда используйте `take` и `skip` для больших наборов данных
4. **Селекты** - используйте `select` для получения только нужных полей
5. **Транзакции** - используйте для связанных операций

### Мониторинг
- Используйте `prisma.$queryRaw` для сложных запросов
- Логируйте медленные запросы
- Мониторьте использование индексов 