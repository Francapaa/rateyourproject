import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getReadingTime } from '@/content/posts'
import { PostBlocks } from '@/components/blog/PostBlocks'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/site'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: {
      absolute: `${post.title} | RateYourProject`,
    },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(', '),
    author: {
      '@type': 'Person',
      name: 'RateYourProject Team',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'RateYourProject',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  }

  return (
    <main className="min-h-screen bg-surface-950 bg-grid">
      <article className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <JsonLd data={articleSchema} />
        <JsonLd data={breadcrumbSchema} />

        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex items-center gap-2 text-sm text-muted font-body"
        >
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span className="text-surface-600">/</span>
          <Link href="/blog" className="hover:text-accent transition-colors">
            Blog
          </Link>
          <span className="text-surface-600">/</span>
          <span className="text-muted-light truncate">{post.title}</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-xs text-muted font-body mb-5">
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <span className="w-1 h-1 rounded-full bg-surface-600" />
            <span>{getReadingTime(post)}</span>
          </div>
          <h1 className="font-display font-700 text-3xl md:text-4xl lg:text-5xl text-balance">
            {post.title}
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted leading-relaxed">{post.description}</p>
        </header>

        <div className="space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-5 font-display font-600 text-2xl md:text-[1.7rem] text-white">
                {section.heading}
              </h2>
              <PostBlocks blocks={section.blocks} />
            </section>
          ))}
        </div>

        <div className="mt-16 p-7 rounded-2xl bg-surface-900 border border-accent/20 text-center">
          <h2 className="font-display font-600 text-xl md:text-2xl text-white">
            Want to know where your project stands?
          </h2>
          <p className="mt-3 text-muted text-sm leading-relaxed max-w-md mx-auto">
            Upload your project and get a free hireability evaluation across the
            6 dimensions, with recommendations to improve.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block px-8 py-3 bg-accent text-surface-950 font-body font-semibold text-sm tracking-wide rounded-lg transition-all duration-300 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20"
          >
            Evaluate your project — free
          </Link>
        </div>
      </article>
    </main>
  )
}