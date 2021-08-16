import {JSDOM} from "jsdom"
import {CommandData} from "../model/command";
import fetch from "node-fetch";
import {MessageAttachment, MessageEmbed, MessageReaction} from "discord.js";

let Images: any[] = [];
let index = 0;
let imageIndex = 0;

class mangaScraper {
    static async getManga(data: CommandData) {
        let number = data.args.pop()!;
        if (!number) {
            number = "1";
        }

        let response = await JSDOM.fromURL(`https://manganato.com/search/story/${data.args.join("_")}`);
        let document = response.window.document;
        //link is a variable which holds the link to the chapters
        let link = document.querySelector("div.item-right>h3>a.a-h.text-nowrap.item-title")!.getAttribute("href");


        let chapterSelect = await JSDOM.fromURL(link!);
        let chapterSelectDocument = chapterSelect.window.document;
        let mangaAnchors = chapterSelectDocument.querySelectorAll("div.panel-story-chapter-list>ul.row-content-chapter>li.a-h>a")!;

        for (let mangaAnchor of mangaAnchors) {
            let megaLink = mangaAnchor.getAttribute("href")
            if (megaLink!.includes(number)!) {

                let mangaReadPage = await JSDOM.fromURL(megaLink!);
                let mangaReadPageDocument = mangaReadPage.window.document;
                let mangaPhotos = mangaReadPageDocument.querySelectorAll("div.container-chapter-reader>img");
                for (let mangaPhoto of mangaPhotos) {
                    let source = await mangaPhoto.getAttribute("src");
                    let responseImage = await fetch(source!, {
                        headers: {
                            Referer: "https://manganato.com"
                        }
                    });
                  /*  let imageBufferAwait = await responseImage.buffer;
                    const bufferStream = new stream.PassThrough();
                    bufferStream.end(imageBufferAwait)*/
                    const attachment = new MessageAttachment(responseImage.body, `${imageIndex++}.png`);
                    Images.push(attachment);
                }
            } else {

            }
        }
        let embed = new MessageEmbed()
            .setImage(`attachment://${index}.png`)
            .attachFiles(Images[index])

        let sendMessage = await data.msg.channel.send(embed)
        await sendMessage.react('◀️')
        await sendMessage.react('▶️')

        const filter = (reaction: MessageReaction) => {
            return ['◀️', '▶️'].includes(reaction.emoji.name)
        }

        while (true) {
            const collected = await sendMessage.awaitReactions(filter, {max: 1, time: 50000, errors: ['time']})
            const reaction = collected.first()!;

            if (reaction.emoji.name === '▶️') {
                index++;
            }
            if (reaction.emoji.name === '◀️' && index > 0) {
                index--;
            }

            let other = new MessageEmbed()
                .setImage(`attachment://${index}.png`)
                .attachFiles(Images[index])

            await sendMessage.delete();
            sendMessage = await data.msg.channel.send(other);
            await sendMessage.react('◀️');
            await sendMessage.react('▶️');

        }
    }

}

export default mangaScraper