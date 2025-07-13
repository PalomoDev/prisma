import React from 'react';
import { SlugParam } from '@/types';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: SlugParam;
}

async function getArticleBySlug(slug: string) {
  // Здесь должна быть логика получения статьи по slug
  // Например, запрос к API или базе данных

  // Заглушка для примера
  return {
    id: '1',
    slug,
    title: `Статья с идентификатором ${slug}`,
    content: 'Содержимое статьи...',
    publishedAt: new Date().toISOString(),
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;

  try {
    const article = await getArticleBySlug(slug);

    if (!article) {
      notFound();
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <time className="text-gray-500">
              {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
            </time>
          </header>

          <div className="prose max-w-none">
            {article.content}
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error('Ошибка при получении статьи:', error);
    notFound();
  }
}

// Опционально: генерация метаданных для страницы
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = params;

  try {
    const article = await getArticleBySlug(slug);

    if (!article) {
      return {
        title: 'Статья не найдена',
      };
    }

    return {
      title: article.title,
      description: article.content.substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'Ошибка при загрузке статьи',
    };
  }
}