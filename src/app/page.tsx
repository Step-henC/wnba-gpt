
"use client"

import Image from "next/image"
import wnbaLogo from "./assets/wnbagptlogo.jpeg"
import {useChat} from "ai/react" //manages streaming of responses from ai provider and updates ui automatically
import { Message } from "ai"
import Bubble from "./components/Bubble"
import PromptSuggestions from "./components/PromptSuggestions"
import LoadingBubble from "./components/LoadingBubble"

const Home =  () => {

    const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()
    const noMessages = !messages || messages.length === 0;
    const handlePrompt = (text: string) => {
            const msg: Message = {
                id: crypto.randomUUID(),
                content: text,
                role: 'user'
            }
            append(msg)
    }

    return (
        <main>
            <Image src={wnbaLogo} width={"250"} alt="WNBA GPT Logo" />
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    <>
                    <p className="starter-text">
                    The ultimate place for WNBA fans! Ask WNBAGPT anyting 
                    about women's basketball and it will return the 
                    most up to date answers. Subscribe for continous access.
                </p>
                <br />
                <PromptSuggestions onPromptClick={handlePrompt} />
                </>
            
            ) : (
            <>
            {messages.map((message, index) => <Bubble key={`message-${index}`} message={message} />)}
            {isLoading && <LoadingBubble /> }
            </>)}
           
            </section>
            <form onSubmit={handleSubmit}>
                <input className="question-box" value={input} placeholder="Ask me something..." onChange={handleInputChange}/>
                <input type="submit" />
            </form>
        </main>
    )
}

export default Home;