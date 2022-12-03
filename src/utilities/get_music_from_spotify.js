import axios from 'axios'
//give a song_name, return the most related song info
const Music_API_Controller = () => {

    const __get_token = async () => {
        const clientId = 'b8a64fb523ae4bc29c758c500516e0cd'
        const clientSecret = 'c93b02e3462649aaa3783af98e54c59f'
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        }
        const uri = 'https://accounts.spotify.com/api/token'
        await axios.post(uri, 'grant_type=client_credentials', headers).then((res) => {
            console.log(res.data)
        })
    }

    const headers = {
        'Accept-Encoding': 'application/json',
        'Connection': 'keep-alive',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US;q=0.9,en;q=0.8',
        'Authorization': 'Bearer c93b02e3462649aaa3783af98e54c59f'
    }

    const music_formatter = (song_name) => {
        const url = 'https://api.spotify.com/v1/search?' + 'type=track' + '&' + `track=${song_name}`
        axios.get(url, headers).then((res) => {
            const $ = cheerio.load(res.data);
            console.log(`Axios got ${res.status}`);
            console.log(res.data);
        }
        ).catch((err) => {
            console.log(err);
        })

    };
    __get_token();
}

Music_API_Controller();

export { Music_API_Controller };