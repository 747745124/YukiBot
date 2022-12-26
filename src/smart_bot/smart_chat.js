import { ChatGPTAPIBrowser } from 'chatgpt'
import { config } from 'dotenv'

config();
async function example() {
    const api = new ChatGPTAPIBrowser({
        email: process.env.OPENAI_EMAIL,
        password: process.env.OPENAI_PASSWORD,
        isGoogleLogin: true
    })
    await api.initSession();
    const result = await api.sendMessage('Hello World!')
    console.log(result.response)
}

// example()