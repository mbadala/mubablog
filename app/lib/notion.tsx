import {Client} from "@notionhq/client";
import * as console from "node:console";
import {NotionToMarkdown} from "notion-to-md";
import {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";


const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

export const getAllPublished = async () => {
    // @ts-ignore
    const databaseId: string = process.env.DATABASE_ID
    const posts = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Published",
            checkbox: {
                equals: true,
            },
        },
        sorts: [
            {
                property: "Date",
                direction: "descending",
            },
        ],
    });

    const allPosts = posts.results;

    return allPosts.map((post) => {
        return getPageMetaData(post);
    });
};

const getPageMetaData = (post) => {
    const getTags = (tags: any[]) => {
        return tags.map((tag) => {
            return tag.name;
        });
    };

    return {
        id: post.id,
        title: post.properties.Page.title[0].plain_text,
        tags: getTags(post.properties.Tags.multi_select),
        // description: post.properties.Description.rich_text[0].plain_text,
        date: post.created_time,
        slug: post.properties.Slug.rich_text[0].plain_text,
    };
};

export const getSinglePost = async (slug: string) => {
    // @ts-ignore
    const databaseId: string = process.env.DATABASE_ID
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Slug",
            formula: {
                string: {
                    equals: slug,
                },
            },
        },
    });

    const page = response.results[0];
    const metadata = getPageMetaData(page);
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    return {
        metadata,
        markdown: mdString,
    };
}

