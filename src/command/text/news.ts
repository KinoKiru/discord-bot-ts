import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import fetch from "node-fetch";
import {MessageEmbed} from "discord.js";


class news extends Command {
    constructor() {
        super("news", ["n"], "gives a new news article", Group.misc, "^(n, news)");
    }

    async execute(data: CommandData) {
        switch (data.args[0]) {
            case "jp":
            case "japan":
            case "nihon":
            case "🇯🇵" :
                await this.LanguageTranslate(data, "jp");
                break;
            case "eng":
            case "english":
            case "🇺🇸":
            case "🇬🇧":
                await this.Language(data, "en");
                break;
            case "nl":
            case "dutch":
            case "nederland":
            case "🇧🇪":
            case "🇳🇱":
                await this.Language(data, "nl");
                break;
            case "es":
            case "esp":
            case "españa":
            case "🇪🇸" :
                await this.LanguageTranslate(data, "es");
                break;
            case "zh":
            case "china":
            case "zhonggoa":
            case "chinese":
            case "🇨🇳":
                await this.LanguageTranslate(data, "zh");
                break;
            case "de":
            case "deutsch":
            case "german":
            case "germany":
            case "deutschland":
            case "🇩🇪":
                await this.LanguageTranslate(data, "de");
                break;
            default :
                await this.Language(data, "en");
                break;
        }


    }

    randomizer(newsreply: number) {
        return Math.floor(Math.random() * newsreply);
    }

    decodeEntities(encodedString: string) {
        const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
        const translate: any = {
            nbsp: " ",
            amp: "&",
            quot: "\"",
            lt: "<",
            gt: ">"
        };
        return encodedString.replace(translate_re, (match: string, entity: any) =>
            translate[entity]
        ).replace(/&#(\d+);/gi, (match, numStr) =>
            String.fromCharCode(parseInt(numStr, 10))
        );
    }


    async Language(data: CommandData, lang: string) {

        let newsResponse = await fetch(`https://newsapi.org/v2/everything?q=keyword&apiKey=${process.env.News}&language=${lang}`);
        let newsReply = await newsResponse.json();
        let article = newsReply.articles[this.randomizer(newsReply.articles.length)];

        await data.msg.channel.send(new MessageEmbed()
            .setTitle(this.decodeEntities(article.title.replace(/\[|]|】|"|\*/g, '')))
            .setURL(article.url)
            .setThumbnail(article.urlToImage)
            .addFields(
                {
                    name: "Description",
                    value: this.decodeEntities(article.description) + ` [meer](${article.url})`
                }
            )
        );

    }


    async LanguageTranslate(data: CommandData, lang: string) {

        let newsResponse = await fetch(`https://newsapi.org/v2/everything?q=keyword&apiKey=${process.env.News}&language=${lang}`);
        let newsReply = await newsResponse.json();
        let article = newsReply.articles[this.randomizer(newsReply.articles.length)]


        //translator
        if (lang == "jp") {
            lang = "ja";
        }

        let response = await fetch(`https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?q=${encodeURIComponent(article.description + " 1252562363 " + article.title)}&langpair=${lang}%7Cen&de=a%40b.c&onlyprivate=0&mt=1`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "b105e7d0d8msh42a06e18a6a76e5p1fa90djsnff2f01c57b6c",
                "x-rapidapi-host": "translated-mymemory---translation-memory.p.rapidapi.com"
            }
        })
        let reply = await response.json();

        let title = reply.responseData.translatedText.split("1252562363");
        let desc = title[0];


        await data.msg.channel.send(new MessageEmbed()
            .setTitle(this.decodeEntities(title[0].replace(/\[|]|】|"|\*/g, '')))
            .setURL(article.url)
            .setThumbnail(article.urlToImage)
            .addFields(
                {
                    name: "Description",
                    value: this.decodeEntities(desc.slice(desc.lastIndexOf("\n")).replace(/\[|]|】|"|\*/g, '')) + ` [meer](${article.url})`
                }
            )
        );
    }

}

export default news;