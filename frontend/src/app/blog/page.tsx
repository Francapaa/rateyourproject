import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getReadingTime } from '@/content/posts'
import { JsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: {
    absolute: 'Blog | RateYourProject',
  },
  description:
    'Guides on hireability, code evaluation and what companies really look for in your project, before the technical interview.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | RateYourProject',
    description: 'Guides on hireability, code evaluation and what companies really look for in your project.',
    url: '/blog',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog' },
  ],
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-surface-950 bg-grid">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <JsonLd data={breadcrumbSchema} />

        <div className="mb-16 md:mb-20">
          <span className="text-xs text-accent font-body tracking-[0.2em] uppercase">
            Guides
          </span>
          <h1 className="mt-4 font-display font-700 text-4xl md:text-5xl lg:text-6xl text-balance">
            The RateYourProject blog
          </h1>
          <p className="mt-5 text-muted max-w-2xl leading-relaxed text-base md:text-lg">
            Practical guides on hireability, code evaluation and what companies
            really look for in your project — written for developers who want
            to show their work at its best.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group p-7 md:p-8 rounded-2xl bg-surface-900 border border-surface-700/50 transition-all duration-300 hover:border-accent/30 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 text-xs text-muted font-body mb-4">
                <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                <span className="w-1 h-1 rounded-full bg-surface-600" />
                <span>{getReadingTime(post)}</span>
              </div>
              <h2 className="font-display font-600 text-xl md:text-2xl text-white group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="mt-3 text-muted-light text-sm leading-relaxed">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}