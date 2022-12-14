import axios from 'axios'
import { config } from 'dotenv'
import cheerio from 'cheerio'
//give a song_name, return the most related song info
const Music_API_Controller = (function () {
    config();
    const __get_token = async () => {
        const clientId = process.env.SPOTIFY_ID
        const clientSecret = process.env.SPOTIFY_SECRET
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        }

        const uri = 'https://accounts.spotify.com/api/token'
        const result = await fetch(uri, {
            method: 'POST',
            headers: headers,
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const __track_searcher = async (token, song, artist = '') => {
        const url = 'https://api.spotify.com/v1/search?query=' + song + '+' + artist + '&type=track&market=US&offset=0&limit=1'
        // console.log(url)
        const result = await fetch(url, {
            'method': 'GET',
            'headers': {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await result.json();
        // console.log(data)
        return data.tracks.items[0].external_urls.spotify;
    };

    return {
        get_token() {
            return __get_token();
        },
        track_searcher(token, song, artist = '') {
            return __track_searcher(token, song, artist = '');
        },
    }
    //test function
    // __get_token().then((token) => { track_searcher(token, 'blue bucket', 'sufjan') });
})();


export { Music_API_Controller };