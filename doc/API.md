# API и Server Actions

## 📋 Обзор

Проект использует **Next.js Server Actions** для серверной бизнес-логики. Все actions возвращают единый формат ответа для консистентности.

## 🔄 Формат ответа

```typescript
interface ActionResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## 📦 Product Actions (`lib/actions/product.actions.ts`)

### Основные функции товаров

#### `createProduct(data)`
- **Назначение**: Создание нового товара
- **Параметры**: `InsertProductSchema` (с подкатегориями, особенностями, спецификациями)
- **Возвращает**: `ActionResponse<Product>`
- **Проверки**: Уникальность slug и SKU, существование категории и бренда

#### `updateProduct(id, data)`
- **Назначение**: Обновление существующего товара
- **Параметры**: `id: string`, `InsertProductSchema`
- **Возвращает**: `ActionResponse<Product>`
- **Особенности**: Обновляет связанные подкатегории, спецификации, особенности

#### `deleteProduct(id)`
- **Назначение**: Удаление товара
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<boolean>`

### Получение товаров

#### `getAllProducts({ page, limit })`
- **Назначение**: Получение всех товаров с пагинацией
- **Параметры**: `page?: number`, `limit?: number`
- **Возвращает**: `GetAllProductsResponse`
- **Включает**: Категории, бренды, связанные данные

#### `getFeaturedProducts(limit)`
- **Назначение**: Получение рекомендуемых товаров
- **Параметры**: `limit?: number` (по умолчанию 4)
- **Возвращает**: `ActionResponse<Product[]>`

#### `getProductById(id)`
- **Назначение**: Получение товара по ID
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<Product>`
- **Включает**: Полную информацию с спецификациями, особенностями

#### `getProductBySlug(slug)`
- **Назначение**: Получение товара по slug
- **Параметры**: `slug: string`
- **Возвращает**: `ActionResponse<Product>`
- **Включает**: Все связанные данные для страницы товара

#### `getGalleryProducts()`
- **Назначение**: Получение товаров для галереи
- **Возвращает**: `ProductsGalleryResponse`
- **Оптимизация**: Только необходимые поля для карточек

## 🛒 Cart Actions (`lib/actions/cart.actions.ts`)

### Управление корзиной

#### `addItemToCart(data)`
- **Назначение**: Добавление товара в корзину
- **Параметры**: `CartItem`
- **Возвращает**: `ActionResponse<boolean>`
- **Особенности**: Работает с гостевыми и авторизованными пользователями

#### `removeItemFromCart(productId)`
- **Назначение**: Уменьшение количества товара на 1
- **Параметры**: `productId: string`
- **Возвращает**: `ActionResponse<boolean>`

#### `removeEntireItemFromCart(productId)`
- **Назначение**: Полное удаление товара из корзины
- **Параметры**: `productId: string`
- **Возвращает**: `ActionResponse<boolean>`

#### `getMyCart()`
- **Назначение**: Получение корзины текущего пользователя
- **Возвращает**: `Cart | null`
- **Особенности**: Автоматически определяет гостевую/пользовательскую корзину

## 👥 User Actions (`lib/actions/user.actions.ts`)

### Управление пользователями

#### `getAllUsers()`
- **Назначение**: Получение всех пользователей (админ)
- **Возвращает**: `ActionResponse<User[]>`
- **Доступ**: Только администраторы

#### `deleteUser(id)`
- **Назначение**: Удаление пользователя
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<boolean>`

## 🏷️ Category Actions (`lib/actions/category.actions.ts`)

### Управление категориями

#### `createCategory(data)`
- **Назначение**: Создание новой категории
- **Параметры**: `CreateCategoryInput`
- **Возвращает**: `ActionResponse<Category>`

#### `updateCategory(id, data)`
- **Назначение**: Обновление категории
- **Параметры**: `id: string`, `UpdateCategoryInput`
- **Возвращает**: `ActionResponse<Category>`

#### `deleteCategory(id)`
- **Назначение**: Удаление категории
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<boolean>`

#### `getCategories(activeOnly?)`
- **Назначение**: Получение всех категорий
- **Параметры**: `activeOnly?: boolean`
- **Возвращает**: `ActionResponse<Category[]>`

#### `getCategoryById(id)`
- **Назначение**: Получение категории по ID
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<Category>`

#### `getCategoriesLight()`
- **Назначение**: Получение категорий с подкатегориями (для меню)
- **Возвращает**: `ActionResponse<CategoryLight[]>`

## 🏷️ Brand Actions (`lib/actions/brand.actions.ts`)

### Управление брендами

#### `createBrand(data)`
- **Назначение**: Создание нового бренда
- **Параметры**: `CreateBrandInput`
- **Возвращает**: `ActionResponse<Brand>`

#### `updateBrand(id, data)`
- **Назначение**: Обновление бренда
- **Параметры**: `id: string`, `UpdateBrandInput`
- **Возвращает**: `ActionResponse<Brand>`

#### `deleteBrand(id)`
- **Назначение**: Удаление бренда
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<boolean>`

#### `getBrands(activeOnly?)`
- **Назначение**: Получение всех брендов
- **Параметры**: `activeOnly?: boolean`
- **Возвращает**: `ActionResponse<Brand[]>`

#### `getBrandById(id)`
- **Назначение**: Получение бренда по ID
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<Brand>`

## 🏷️ Subcategory Actions (`lib/actions/subcategory.actions.ts`)

### Управление подкатегориями

#### `createSubcategory(data)`
- **Назначение**: Создание новой подкатегории
- **Параметры**: `CreateSubcategoryInput`
- **Возвращает**: `ActionResponse<Subcategory>`

#### `updateSubcategory(id, data)`
- **Назначение**: Обновление подкатегории
- **Параметры**: `id: string`, `UpdateSubcategoryInput`
- **Возвращает**: `ActionResponse<Subcategory>`

#### `deleteSubcategory(id)`
- **Назначение**: Удаление подкатегории
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<boolean>`

#### `getSubcategories(activeOnly?)`
- **Назначение**: Получение всех подкатегорий
- **Параметры**: `activeOnly?: boolean`
- **Возвращает**: `ActionResponse<Subcategory[]>`

#### `getSubcategoryById(id)`
- **Назначение**: Получение подкатегории по ID
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<Subcategory>`

## 🔧 Spec & Features Actions (`lib/actions/spec-features.actions.ts`)

### Управление спецификациями

#### `createSpecification(data)`
- **Назначение**: Создание новой спецификации
- **Параметры**: `CreateSpecificationInput`
- **Возвращает**: `ActionResponse<Specification>`

#### `updateSpecification(id, data)`
- **Назначение**: Обновление спецификации
- **Параметры**: `id: string`, `UpdateSpecificationInput`
- **Возвращает**: `ActionResponse<Specification>`

#### `deleteSpecification(id)`
- **Назначение**: Удаление спецификации
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<boolean>`

#### `getAllSpecifications(activeOnly?)`
- **Назначение**: Получение всех спецификаций
- **Параметры**: `activeOnly?: boolean`
- **Возвращает**: `ActionResponse<Specification[]>`

#### `getSpecificationById(id)`
- **Назначение**: Получение спецификации по ID
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<Specification>`

### Управление особенностями

#### `createFeature(data)`
- **Назначение**: Создание новой особенности
- **Параметры**: `CreateFeatureInput`
- **Возвращает**: `ActionResponse<Feature>`

#### `updateFeature(id, data)`
- **Назначение**: Обновление особенности
- **Параметры**: `id: string`, `UpdateFeatureInput`
- **Возвращает**: `ActionResponse<Feature>`

#### `deleteFeature(id)`
- **Назначение**: Удаление особенности
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<boolean>`

#### `getAllFeatures(activeOnly?)`
- **Назначение**: Получение всех особенностей
- **Параметры**: `activeOnly?: boolean`
- **Возвращает**: `ActionResponse<Feature[]>`

#### `getFeatureById(id)`
- **Назначение**: Получение особенности по ID
- **Параметры**: `id: string`
- **Возвращает**: `ActionResponse<Feature>`

## 🔐 Auth Actions (`lib/actions/auth.actions.ts`)

### Аутентификация

#### `signUp(data)`
- **Назначение**: Регистрация нового пользователя
- **Параметры**: `SignUpFormInput`
- **Возвращает**: `ActionResponse<User>`
- **Особенности**: Хеширование пароля, проверка уникальности email

#### `signInWithCredentials(data)`
- **Назначение**: Вход с email и паролем
- **Параметры**: `LoginUserInput`
- **Возвращает**: `ActionResponse<User>`
- **Особенности**: Проверка пароля, создание сессии

## 🌐 API Routes (`app/api/`)

### NextAuth.js (`app/api/auth/[...nextauth]/route.ts`)
- **Назначение**: Обработка аутентификации
- **Эндпоинты**: `/api/auth/signin`, `/api/auth/signout`, `/api/auth/session`

### UploadThing (`app/api/uploadthing/`)
- **Назначение**: Загрузка файлов
- **Эндпоинты**: `/api/uploadthing`
- **Поддерживаемые типы**: Изображения товаров, логотипы брендов

## 🔧 Утилиты

### `formatError(error)`
- **Назначение**: Форматирование ошибок для пользователя
- **Местоположение**: `lib/utils.ts`

### `prismaToJson(data)`
- **Назначение**: Сериализация Prisma объектов
- **Местоположение**: `lib/utils/prisma-serializer.ts`

### `requireAdmin()`
- **Назначение**: Проверка прав администратора
- **Местоположение**: `lib/auth-guard.ts`

## 📝 Примеры использования

### В серверном компоненте
```typescript
// app/admin/products/page.tsx
export default async function AdminProductPage() {
  const products = await getAllProducts({ page: 1 });
  
  if (!products.success) {
    return <div>Error: {products.message}</div>;
  }
  
  return <ProductTable products={products.data} />;
}
```

### В клиентском компоненте
```typescript
// components/forms/product-form.tsx
'use client';

const handleSubmit = async (data: FormData) => {
  const result = await createProduct(data);
  
  if (result.success) {
    toast.success('Товар создан успешно');
    router.push('/admin/products');
  } else {
    toast.error(result.message || 'Ошибка создания товара');
  }
};
```

### Обработка ошибок
```typescript
try {
  const result = await someAction(data);
  return result;
} catch (error) {
  console.error('Action error:', error);
  return {
    success: false,
    error: formatError(error)
  };
}
```

## 🔄 Middleware

### `middleware.ts`
- **Назначение**: Защита маршрутов, проверка ролей
- **Защищенные маршруты**: `/admin/*`, `/shipping-*`, `/profile/*`
- **Особенности**: Автоматическое создание сессионной корзины

## 📊 Валидация

Все Server Actions используют **Zod схемы** для валидации входных данных:

- `insertProductSchema` - создание/обновление товаров
- `cartItemSchema` - элементы корзины
- `createCategorySchema` - создание категорий
- `signUpFormSchema` - регистрация пользователей

## 🚀 Рекомендации

### Производительность
1. **Параллельные запросы** - используйте `Promise.all()` для независимых операций
2. **Селективные запросы** - загружайте только необходимые поля
3. **Кэширование** - используйте `revalidatePath()` для обновления кэша

### Безопасность
1. **Валидация** - всегда валидируйте входные данные
2. **Авторизация** - проверяйте права доступа в каждом action
3. **Сериализация** - используйте `prismaToJson()` для безопасной передачи данных

### Отладка
1. **Логирование** - добавляйте console.log для отладки
2. **Типизация** - используйте TypeScript для отлова ошибок
3. **Обработка ошибок** - всегда оборачивайте в try/catch 