// load db // scrape internet for info

import {DataAPIClient } from "@datastax/astra-db-ts"

import OpenAI from 'openai'
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter' // split up large internet text for digestible answers
import "dotenv/config"
import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer';

// determine how similar two vectors are 
// euclidean is most commonly used. Smaller value uses closer
type SimiliarityMetric = "dot_product" | "cosine" | "euclidean"


 // Nextjs Destructering objects is tricky per docs
 // I would have to manually name ea env var from process.env
 // as oppose to creating a type for typescript
 // so our strict typescript policy is false for the time being
const {
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APP_TOKEN,
    OPENAI_API_KEY
}  = process.env

const openai = new OpenAI({apiKey: OPENAI_API_KEY}); //GPT_4 last updated 2021 so scrape for new data

const wnbaData = [
'https://en.wikipedia.org/wiki/Women%27s_National_Basketball_Association',
'https://www.wnba.com/schedule?season=2025&month=all',
'https://www.espn.com/wnba/',
'https://www.basketball-reference.com/wnba/years/2024.html',
'https://www.basketball-reference.com/wnba/years/2023.html',
'https://www.basketball-reference.com/wnba/draft/2024.html',
'https://www.basketball-reference.com/wnba/draft/2023.html',
'https://www.basketball-reference.com/wnba/draft/2022.html',
'https://www.basketball-reference.com/wnba/allstar/WNBA_2024.html',
'https://www.basketball-reference.com/wnba/allstar/WNBA_2023.html',
'https://frontofficesports.com/the-25-highest-paid-wnba-players/',
'https://herhoopstats.com/salary-cap-sheet/wnba/players/salary_2023/stats_2022/'
]

// scrape

const client = new DataAPIClient(ASTRA_DB_APP_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})

//chunk size is num of characters in ea chunk and amt of overlapping chars between chunks
// ensure accuracy of results in case a key phrase was cut
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})


//create collection from file instead from astra UI
const createCollection = async(similiarityMetric: SimiliarityMetric = "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            metric: similiarityMetric,
            dimension: 1536 //dimension for text-embedding-3-small on openai is 1536 also on datastax docs for openai
        }
    })

    console.log(res)
}

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    for await (const url of wnbaData) {
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);

        //openai docs uses this as an example
        for await (const chunk of chunks) {
            const embedding = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: chunk,
                encoding_format: "float"
            })
            //openai docs shows the embedding response. We get an array of embedding floats
            const vector = embedding.data[0].embedding

            const res = await collection.insertOne({
                $vector: vector,
                text: chunk
            })

            console.log(res)
        }

    }
}


const scrapePage = async (url: string) => {
//puppeteer diff from cheerio (langchain scraper) scraper in that it uses a browser and lets js run on page 
// in case js is important for content on page 
const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
        headless: true
    }, 
    gotoOptions: {
        waitUntil: 'domcontentloaded'
    }, 
    evaluate: async (page, browser) => {
       const res =  await page.evaluate(() => document.body.innerHTML) //extract data from page and interact with elements
       await browser.close()
       return res
    }
})
    //regex for stripping html tags from page content to feed to our llm /ai assistant
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '');
}

 createCollection().then(() => loadSampleData())
