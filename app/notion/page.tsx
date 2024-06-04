import {NotionBlogPosts} from "../components/posts";

export default function Page() {
    return (
        <section>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
            <NotionBlogPosts />
        </section>
    )
}



