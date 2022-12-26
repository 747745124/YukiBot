import { ChatGPTAPI, getOpenAIAuth } from 'chatgpt'
import { config } from 'dotenv'

async function example() {
    config();
    // use puppeteer to bypass cloudflare (headful because of captchas)
    const openAIAuth = await getOpenAIAuth({
        email: process.env.OPENAI_EMAIL,
        password: process.env.OPENAI_PASSWORD
    })

    const api = new ChatGPTAPI({ ...openAIAuth })
    await api.ensureAuth()

    // send a message and wait for the response
    const response = await api.sendMessage(
        'Write a python version of bubble sort.'
    )

    // response is a markdown-formatted string
    console.log(response)
}

example()