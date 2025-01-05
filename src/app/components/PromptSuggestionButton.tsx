


const PromptSuggestionButton = ({handleClick, text}) => {

    return (
        <button onClick={handleClick} className="prompt-suggestion-btn">
                    {text}
        </button>
    )
}

export default PromptSuggestionButton;