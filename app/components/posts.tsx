import Link from 'next/link'
import {formatDate, getBlogPosts, getToday} from 'app/blog/utils'
import {getAllPublished} from "../lib/notion";


export async function NotionBlogPosts() {
  let allBlogs = await getAllPublished()
  return (
      <div>
        {allBlogs.sort((a, b) => {
          if (new Date(a.date) > new Date(b.date)) {
            return -1
          }
          return 1
        }).map(
            (post) => (
                <Link
                    key={post.slug}
                    className="flex flex-col space-y-1 mb-4"
                    href={`/notion/${post.slug}`}
                >
                  <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                    <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                      {getToday(post.date)}
                    </p>
                    <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                      {post.title}
                    </p>
                  </div>
                </Link>
            )
        )}
      </div>
  )
}

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
