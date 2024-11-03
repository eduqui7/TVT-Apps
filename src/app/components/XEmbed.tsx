'use client'

import { useState, useEffect } from 'react'

const XEmbed = () => {
    const [postUrl, setPostUrl] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [tweetId, setTweetId] = useState('')

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = true
        script.setAttribute('data-dnt', 'true')
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const extractTweetId = (url: string) => {
        const matches = url.match(/status\/(\d+)/)
        return matches ? matches[1] : null
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleEmbed = () => {
        if (inputValue.includes('twitter.com') || inputValue.includes('x.com')) {
            const id = extractTweetId(inputValue)
            if (id) {
                setTweetId(id)
                setPostUrl(inputValue)
            }
        }
    }

    const saveAsHtml = () => {
        if (!tweetId) return

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Card</title>
        </head>
        <body>
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    margin: 0;
                }
                body {
                    overflow: hidden;
                }
                .card {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100vh;
                    border-radius: 3px;
                    padding: 0%;
                    margin-bottom: 20px;
                }
                iframe {
                    border: none;
                    height: 100vh;
                    margin-top: 30px;
                    
        
                }
            </style>
    <div class="card">
        <iframe
            src="https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=true"
            width="550"
            height="550"
            frameborder="0"
            scrolling="no">
        </iframe>
    </div>
</body>
</html>`

        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'x-embed.html'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-2/4 mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Card X/Twitter</h1>
            <div>
                <label htmlFor="newsLink" className="block mb-2">
                    Cole o URL do post:
                </label>
                <input
                    type="text"
                    placeholder="https://"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-base-100"
                />
                <button
                    onClick={handleEmbed}
                    className="mt-3 mb-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mr-2"
                >
                    Gerar
                </button>
                {tweetId && (
                    <button
                        onClick={saveAsHtml}
                        className="mt-3 mb-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Salvar HTML
                    </button>
                )}
            </div>
            {tweetId && (
                <div className="mt-4">
                    <iframe
                        src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=true`}
                        width="300px"
                        height="680px"
                        frameBorder="0"
                        scrolling="no"
                        // style={{ maxWidth: '100%' }}
                    ></iframe>
                </div>
            )}
        </div>
    )
}

export default XEmbed
