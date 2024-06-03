import {Client} from "@notionhq/client";
import * as console from "node:console";


const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

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
    const getTags = (tags) => {
        return tags.map((tag) => {
            return tag.name;
        });
    };
    console.log(post)

    return {
        id: post.id,
        title: post.properties.Page.title[0].plain_text,
        // tags: getTags(post.properties.Tags.multi_select),
        // description: post.properties.Description.rich_text[0].plain_text,
        date: getToday(post.properties.Date.last_edited_time),
        slug: post.properties.Slug.rich_text[0].plain_text,
    };
};


function getToday (date_string: string | number | Date) {
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let date = new Date();

    if (date_string) {
        date = new Date(date_string);
    }

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

