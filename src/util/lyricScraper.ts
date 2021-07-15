import axios from 'axios';
import cheerio from 'cheerio';


class LyricScraper {

    async Scaper(songName: string) {
        console.log(songName);
        const url = `https://www.musixmatch.com/search/${encodeURIComponent(songName)}`;
        const AxiosInstance = axios.create(); // Create a new Axios Instance


        let awaitInstance = await AxiosInstance.get(url);
        const html = awaitInstance.data; // Get the HTML from the HTTP request
        const $ = cheerio.load(html);
        const resultAnchor: cheerio.Cheerio = $('h2.media-card-title > a');
        if (resultAnchor["0" as any]) {
            // @ts-ignore
            return await this.lyrics(resultAnchor["0" as any].attribs.href);
        } else {
            return "Couldn't find lyrics";
        }
    }

    async lyrics(Result: string) {


        const url = `https://www.musixmatch.com${Result}/translation/english`; // URL we're scraping
        const AxiosInstance = axios.create(); // Create a new Axios Instance


        let awaitInstance = await AxiosInstance.get(url);

        const html = awaitInstance.data; // Get the HTML from the HTTP request
        const $ = cheerio.load(html);
        let lyricsDivs: cheerio.Cheerio = $('div.col-xs-6.col-sm-6.col-md-6.col-ml-6.col-lg-6 > div > div'); // Parse the HTML and extract just whatever code contains .statsTableContainer and has tr inside

        if (lyricsDivs[0] == undefined) {
            return "lyrics not found";
        }

        let lyrics = "";
        for (let lyricsDiv of lyricsDivs) {

            // @ts-ignore
            if (lyricsDiv.children[0]) {
                // @ts-ignore
                lyrics += lyricsDiv.children[0].data + "\n";
            } else {
                console.log(lyricsDiv);
            }

        }
        return lyrics;
    }
}

export default LyricScraper

