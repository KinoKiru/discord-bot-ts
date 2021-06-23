import {NHentai} from 'nhentai.js-api';
import Command, {CommandData} from "../../model/command";
import {MessageEmbed} from "discord.js";
import Group from "../../model/group";

class meep extends Command {

    constructor() {
        super("meep", ["hentai"], "shows hanime", Group.nsfw, "!(meep/hentai)");
    }

    async execute(data: CommandData) {
        const api = new NHentai();
        const hentai = await api.random(false);
        await data.msg.channel.send(new MessageEmbed()
            .setTitle(hentai.title)
            .setThumbnail(hentai.cover)
            .setURL(hentai.url)
            .addField("tags", this.hentaiOntleed(hentai.tags), true)
            .addFields(
                {name: "author", value: "" + this.validator(hentai.artists), inline: false},
                {name: "characters", value: "" + this.validator(hentai.characters), inline: false},
                {name: "genre", value: "" + this.validator(hentai.categories), inline: false},
                {name: "language", value: "" + this.validator(hentai.languages), inline: false},
                {name: "parodies", value: "" + this.validator(hentai.parodies), inline: false},
            )
            .setColor("#cd52f2")
        )
    }

    hentaiOntleed(hentaiTags: string[]) {
        let tags: string = ""
        for (const hentaitag of hentaiTags) {
            tags += `[\`${hentaitag}\`](https://nhentai.net/${hentaitag.replace(/ /g,"-")}) `;
        }
        return tags
    }

    validator(hentai: string[]) {
        if (hentai == null || "" || undefined || hentai.length <= 0) {
            return "`" + "none" + "`";
        } else if (Array.isArray(hentai)) {
            return this.hentaiOntleed(hentai);
        }
    }

}

export default meep