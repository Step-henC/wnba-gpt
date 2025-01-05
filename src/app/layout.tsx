import "./global.css"


export const metadata = {
    title:"WNBA GPT",
    description: "The expert on all things related to the WNBA"
}

const RootLayout = ({children}) => {
    return (
        <html lang='en'>
            <body>{children}</body>
        </html>
    )
}

export default RootLayout;