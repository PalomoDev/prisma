# Neon Debug App - Интернет-магазин туристического снаряжения

## 📋 Описание проекта

Это современный интернет-магазин туристического снаряжения, построенный на Next.js 15 с использованием App Router. Проект включает в себя полную систему управления товарами, корзиной, заказами и административную панель.

## 🛠️ Технический стек

### Frontend
- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Shadcn/UI** - библиотека компонентов
- **Lucide Icons** - иконки

### Backend
- **Next.js Server Actions** - серверная логика
- **PostgreSQL** - основная база данных
- **Prisma** - ORM для работы с БД
- **NextAuth.js** - аутентификация

### Дополнительные библиотеки
- **Zod** - валидация схем данных
- **React Hook Form** - управление формами
- **Embla Carousel** - карусели
- **UploadThing** - загрузка файлов

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Настройка переменных окружения
Создайте файл `.env.local` на основе `.env.example`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/neon_debug"
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Запуск миграций
```bash
npx prisma migrate dev
```

### Наполнение базы данных
```bash
npm run seed
```

### Запуск в режиме разработки
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## 📁 Структура проекта

```
neon-debug-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Группа маршрутов аутентификации
│   ├── (root)/            # Основные страницы
│   ├── admin/             # Административная панель
│   └── api/               # API маршруты
├── components/            # React компоненты
│   ├── admin/            # Компоненты админки
│   ├── shared/           # Общие компоненты
│   └── ui/               # UI компоненты (Shadcn)
├── lib/                  # Утилиты и хелперы
│   ├── actions/          # Server Actions
│   ├── validations/      # Zod схемы
│   └── utils/            # Вспомогательные функции
├── prisma/               # Prisma схема и миграции
├── public/               # Статические файлы
├── types/                # TypeScript типы
└── doc/                  # Документация
```

## 🔧 Основные команды

```bash
# Разработка
npm run dev                 # Запуск dev сервера
npm run build              # Сборка для production
npm run start              # Запуск production сервера

# База данных
npm run seed               # Наполнение БД тестовыми данными
npm run studio             # Prisma Studio

# Линтинг
npm run lint               # Проверка кода
```

## 📊 Основные функции

### Для покупателей
- ✅ Просмотр каталога товаров
- ✅ Фильтрация по категориям и брендам
- ✅ Детальные страницы товаров
- ✅ Корзина покупок
- ✅ Регистрация и аутентификация
- ✅ Оформление заказов

### Для администраторов
- ✅ Управление товарами
- ✅ Управление категориями и подкатегориями
- ✅ Управление брендами
- ✅ Модульная система спецификаций
- ✅ Управление особенностями товаров
- ✅ Управление пользователями

## 🗂️ Документация

- [Архитектура проекта](./ARCHITECTURE.md)
- [База данных](./DATABASE.md)
- [API и Server Actions](./API.md)
- [Руководство разработчика](./DEVELOPMENT.md)
- [Административная панель](./ADMIN.md)
- [Развертывание](./DEPLOYMENT.md)
- [Журнал изменений](./CHANGELOG.md)

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License.

## 🔗 Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com) 