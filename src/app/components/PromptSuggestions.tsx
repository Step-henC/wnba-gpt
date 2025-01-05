import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestions = ({onPromptClick}) => {

    const prompts = ["Who is the WNBA rookie of the year?", 
        "Who is the highest paid WNBA player", 
        "Which team is the current WNBA champion?",
        "Who was drafted second in the WNBA draft of 2024"
    ]

    return (
        <div className={"prompt-suggestion"}>
            {prompts.map((prompt, index) => <PromptSuggestionButton 
            handleClick={() => onPromptClick(prompt)} 
            text={prompt} 
            key={`suggestion-${index}`}/>)}
        </div>
    )
}


export default PromptSuggestions;