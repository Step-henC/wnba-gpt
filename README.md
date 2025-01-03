## WNBA-GPT

AI ChatBot Assistant seeded with current WNBA data to get the latest information on the W. With the WNBA reaching record numbers of viewership and revenue, interest in women's sports is at an all-time high. However, new viewers may want to brush up on specific WNBA info from an assistant with NLP responses.

Popular llm like Chat-GPT-4 has knowledge limited to the year 2021. But WNBA All-star Caitlin Clark, the catalyst for the WNBA's recent success, made her professional debut in 2024 (winning her female athelete of the year) well beyond the 2021 cutoff data. In addition to a slew of other 2024 WNBA rookies including NCAA Champion Angel Reese, Clark's teammate Kate Martin and 4x NBA Champion Steph Curry's protege, Cameron Brink.

So, we create a RAG chatbot trained on WNBA scraped by the internet from a Puppeteer web scraper. The web-scraped data is then chunked and stored into a vector db with OpenAI embeddings. Vector embeddings allow for AI to group similar data together while usng LLM from OpenAI for semantic responses. The result is a WNBA Expert AI Chatbot ready to get us invested in the growing game of women's basketball.

## Getting Started

    ### Prerequisites
        - OpenAI api key
        - Astra DB for vector embeddings and API key
        - latest node version installed

First, clone `npm i`
Then, seed the db with `npm run seed`. This will take some time, so get comfortable.
Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
