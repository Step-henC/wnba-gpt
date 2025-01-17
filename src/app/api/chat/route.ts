import { createOpenAI } from '@ai-sdk/openai';
import { embed, streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";


const ASTRA_DB_NAMESPACE: string = process.env.ASTRA_DB_NAMESPACE || ''
const ASTRA_DB_COLLECTION: string = process.env.ASTRA_DB_COLLECTION || ''
const ASTRA_DB_API_ENDPOINT:string = process.env.ASTRA_DB_API_ENDPOINT || ''
const ASTRA_DB_APP_TOKEN:string = process.env.ASTRA_DB_APP_TOKEN || ''
const OPENAI_API_KEY:string = process.env.OPENAI_API_KEY || ''

const openai = createOpenAI({
    apiKey: OPENAI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APP_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})


export async function POST(req: Request) {
    try{
            const {messages} = await req.json();
            const latestMessage = messages[messages.length -1 ]?.content;
            //what we will send over
            let docContext = ""

            //create an embedding from user query
        const {embedding } = await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: latestMessage,

        })

            try {
                // search db for embeddings of user query that are similar. limit first 10 res
                const collection = await db.collection(ASTRA_DB_COLLECTION)
                const result = collection.find({}, {
                    sort: {
                        $vector: embedding,
                    },
                    limit: 10
                })

                const documents = await result.toArray()
                const docsMap = documents?.map((doc) => doc.text)
                docContext = JSON.stringify(docsMap)
            } catch (e) {
                console.log("CANNOT QUERY DB", e)
                docContext = ""
            }

            const template = {
                role: "system",
                content: `You are an AI assistant who knows everything about the Women's National Basketball Association abbreviated as WNBA.
                Use the below context argument to what you know about the WNBA. 
                The context will provide you with most recent page data from Wikipedia, ESPN, official WNBA website and other sources.
                If the context does not include the information you need, then answer based on your existing knownledge and don't mention the source of your information or what the context
                does or does not include. Format responses using markdown where applicable and do not return images.
                ------------------------
                START CONTEXT
                ${docContext}
                END CONTEXT
                ------------------------`
            }

            const result = streamText({
                  model: openai('gpt-4'), //stops at 2021 so we are adding new knowledge
                  system: template.content,
                  prompt: latestMessage
            
            })

            return result.toDataStreamResponse();

          
    } catch (error) {
        console.log("ERROR ", error)
    }
}