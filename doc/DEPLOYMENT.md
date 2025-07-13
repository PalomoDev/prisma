# Развертывание

## 🚀 Обзор

Данное руководство описывает процесс развертывания приложения в различных окружениях: development, staging и production.

## 📋 Предварительные требования

### Минимальные требования к серверу
- **Node.js**: 18.x или выше
- **RAM**: минимум 1GB, рекомендуется 2GB+
- **Диск**: минимум 5GB свободного места
- **PostgreSQL**: 14.x или выше
- **SSL сертификат**: для production окружения

### Внешние сервисы
- **PostgreSQL** база данных
- **UploadThing** для загрузки файлов (опционально)
- **Email провайдер** для уведомлений (опционально)

## 🔧 Переменные окружения

### Обязательные переменные
```env
# База данных
DATABASE_URL="postgresql://username:password@host:5432/database"

# Аутентификация
AUTH_SECRET="your-super-secret-key-minimum-32-characters"
NEXTAUTH_URL="https://your-domain.com"

# Приложение
NODE_ENV="production"
```

### Дополнительные переменные
```env
# Загрузка файлов
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Email (опционально)
EMAIL_SERVER="smtp://username:password@smtp.server.com:587"
EMAIL_FROM="noreply@your-domain.com"

# Настройки приложения
PAGE_SIZE=12
PAYMENT_METHODS="PayPal, Stripe, CashOnDelivery"
DEFAULT_PAYMENT_METHOD="PayPal"
```

## 🌐 Развертывание на Vercel

### Быстрое развертывание
1. **Подключите репозиторий**
   - Импортируйте проект в Vercel
   - Выберите фреймворк Next.js

2. **Настройте переменные окружения**
   ```
   DATABASE_URL=postgresql://...
   AUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

3. **Настройте команды сборки**
   ```json
   {
     "buildCommand": "npm run build",
     "installCommand": "npm install",
     "devCommand": "npm run dev"
   }
   ```

4. **Разверните приложение**
   - Нажмите "Deploy"
   - Дождитесь завершения сборки

### Настройка базы данных
1. **Создайте базу данных**
   - Используйте Neon, Supabase или другой PostgreSQL провайдер
   - Получите строку подключения

2. **Примените миграции**
   ```bash
   npx prisma migrate deploy
   ```

3. **Заполните базу данных**
   ```bash
   npm run seed
   ```

## 🐳 Развертывание с Docker

### Создание Docker образа
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Установка зависимостей
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерация Prisma Client
RUN npx prisma generate

# Сборка Next.js
RUN npm run build

# Production образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/neon_debug
      - AUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
    volumes:
      - ./prisma:/app/prisma

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=neon_debug
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Команды для развертывания
```bash
# Сборка и запуск
docker-compose up -d

# Применение миграций
docker-compose exec app npx prisma migrate deploy

# Заполнение базы данных
docker-compose exec app npm run seed
```

## ☁️ Развертывание на VPS

### Подготовка сервера
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PostgreSQL
sudo apt install postgresql postgresql-contrib

# Установка PM2
npm install -g pm2

# Установка Nginx
sudo apt install nginx
```

### Настройка базы данных
```bash
# Создание пользователя и базы данных
sudo -u postgres psql

CREATE USER neon_user WITH PASSWORD 'secure_password';
CREATE DATABASE neon_debug OWNER neon_user;
GRANT ALL PRIVILEGES ON DATABASE neon_debug TO neon_user;
\q
```

### Деплой приложения
```bash
# Клонирование репозитория
git clone https://github.com/your-username/neon-debug-app.git
cd neon-debug-app

# Установка зависимостей
npm install

# Создание файла переменных окружения
cp .env.example .env.local
# Отредактируйте .env.local с вашими значениями

# Сборка приложения
npm run build

# Применение миграций
npx prisma migrate deploy

# Заполнение базы данных
npm run seed
```

### Настройка PM2
```bash
# Создание ecosystem файла
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'neon-debug-app',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Запуск приложения
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Настройка Nginx
```nginx
# /etc/nginx/sites-available/neon-debug-app
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Статические файлы
    location /_next/static {
        alias /path/to/app/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Активация сайта
sudo ln -s /etc/nginx/sites-available/neon-debug-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL сертификат
```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔒 Безопасность в Production

### Настройки безопасности
```env
# Убедитесь, что используете сильный секретный ключ
AUTH_SECRET="very-long-random-string-at-least-32-characters"

# Используйте HTTPS в production
NEXTAUTH_URL="https://your-domain.com"

# Отключите debug в production
NODE_ENV="production"
```

### Firewall настройки
```bash
# Настройка UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### Мониторинг
```bash
# Логи PM2
pm2 logs

# Статус приложения
pm2 status

# Мониторинг ресурсов
pm2 monit
```

## 📊 Мониторинг и логирование

### Настройка логирования
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'neon-debug-app',
    script: 'npm',
    args: 'start',
    log_file: '/var/log/neon-debug-app/combined.log',
    error_file: '/var/log/neon-debug-app/error.log',
    out_file: '/var/log/neon-debug-app/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    max_restarts: 10,
    restart_delay: 5000
  }]
}
```

### Мониторинг производительности
```bash
# Установка htop для мониторинга
sudo apt install htop

# Мониторинг дискового пространства
df -h

# Мониторинг памяти
free -h

# Мониторинг нагрузки
uptime
```

## 🔄 Обновления и развертывание

### Процесс обновления
```bash
# Скрипт обновления
#!/bin/bash
cd /path/to/app

# Остановка приложения
pm2 stop neon-debug-app

# Получение обновлений
git pull origin main

# Установка новых зависимостей
npm install

# Применение миграций
npx prisma migrate deploy

# Сборка приложения
npm run build

# Запуск приложения
pm2 start neon-debug-app

echo "Deployment completed!"
```

### Автоматическое развертывание
```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /path/to/app
          ./deploy.sh
```

## 📈 Масштабирование

### Горизонтальное масштабирование
```bash
# Увеличение количества PM2 процессов
pm2 scale neon-debug-app +2

# Автоматическое масштабирование
pm2 start ecosystem.config.js -i max
```

### Оптимизация базы данных
```sql
-- Индексы для производительности
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- Анализ производительности
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 'uuid';
```

### Кэширование
```javascript
// Настройка Redis (опционально)
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

// Кэширование запросов
const getCachedProducts = async (key) => {
  const cached = await client.get(key);
  return cached ? JSON.parse(cached) : null;
};
```

## 🛠️ Решение проблем

### Частые проблемы

#### Приложение не запускается
```bash
# Проверка логов
pm2 logs neon-debug-app

# Проверка портов
sudo netstat -tlnp | grep :3000

# Проверка процессов
ps aux | grep node
```

#### Проблемы с базой данных
```bash
# Проверка подключения
psql -h localhost -U neon_user -d neon_debug

# Проверка миграций
npx prisma migrate status

# Сброс миграций (осторожно!)
npx prisma migrate reset
```

#### Проблемы с SSL
```bash
# Проверка сертификата
sudo certbot certificates

# Обновление сертификата
sudo certbot renew

# Проверка Nginx конфигурации
sudo nginx -t
```

## 📋 Чек-лист для развертывания

### Перед развертыванием
- [ ] Все тесты пройдены
- [ ] Переменные окружения настроены
- [ ] База данных подготовлена
- [ ] SSL сертификат получен
- [ ] Backup стратегия настроена

### После развертывания
- [ ] Приложение доступно по HTTPS
- [ ] Все функции работают корректно
- [ ] Мониторинг настроен
- [ ] Логи записываются
- [ ] Автоматические обновления настроены

## 🔄 Backup и восстановление

### Backup базы данных
```bash
# Создание backup
pg_dump -h localhost -U neon_user -d neon_debug > backup_$(date +%Y%m%d_%H%M%S).sql

# Автоматический backup
0 2 * * * /usr/bin/pg_dump -h localhost -U neon_user -d neon_debug > /backups/neon_debug_$(date +\%Y\%m\%d).sql
```

### Восстановление
```bash
# Восстановление из backup
psql -h localhost -U neon_user -d neon_debug < backup_file.sql

# Восстановление с пересозданием базы
dropdb -h localhost -U neon_user neon_debug
createdb -h localhost -U neon_user neon_debug
psql -h localhost -U neon_user -d neon_debug < backup_file.sql
```

## 📞 Поддержка

При возникновении проблем с развертыванием:
1. Проверьте логи приложения
2. Убедитесь в правильности переменных окружения
3. Проверьте статус внешних сервисов
4. Обратитесь к документации используемых сервисов

Для получения помощи создайте issue в репозитории с описанием проблемы и логами. 