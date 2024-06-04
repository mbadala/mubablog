import {notFound} from "next/navigation";
import {getAllPublished, getSinglePost} from "../../lib/notion";
import {CustomMDX} from "../../components/mdx";
import {baseUrl} from "../../sitemap";
import {getToday} from "../../blog/utils";


export async function generateStaticParams() {
    let posts = await getAllPublished()

    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }) {
    let post = await getSinglePost(params.slug);

    if (!post) {
        return notFound()
    }

    let {
        id,
        title,
        tags,
        date: publishedTime,
        slug: description,
    } = post.metadata

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime,
            url: `${baseUrl}/blog/${post.metadata.slug}`,
            // images: [
            //     {
            //         url: ogImage,
            //     },
            // ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            // images: [ogImage],
        },
    }
}


export default async function Blog({ params }) {
    let post = await getSinglePost(params.slug);

    if (!post) {
        notFound()
    }

    return (
        <section>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.metadata.title,
                        datePublished: post.metadata.date,
                        dateModified: post.metadata.date,
                        // description: post.metadata.summary,
                        // image: post.metadata.image
                        //     ? `${baseUrl}${post.metadata.image}`
                        //     : `/og?title=${encodeURIComponent(post.metadata.title)}`,
                        // url: `${baseUrl}/blog/${post.slug}`,
                        author: {
                            '@type': 'Person',
                            name: 'My Portfolio',
                        },
                    }),
                }}
            />
            <h1 className="title font-semibold text-2xl tracking-tighter">
                {post.metadata.title}
            </h1>
            <div className="flex justify-between items-center mt-2 mb-8 text-sm">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {getToday(post.metadata.date)}
                </p>
            </div>
            {/*<ReactMarkdown>{post.markdown.parent}</ReactMarkdown>*/}
            <article className="prose">
                <CustomMDX source={post.markdown.parent}/>
            </article>
        </section>
    )
}
