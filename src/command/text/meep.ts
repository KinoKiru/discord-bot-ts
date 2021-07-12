import {NHentai, Tag} from 'nhentai.js-api';
import Command, {CommandData} from "../../model/command";
import {MessageEmbed} from "discord.js";
import Group from "../../model/group";

class meep extends Command {

    constructor() {
        super("meep", ["hentai"], "shows hanime", Group.nsfw, "^(meep/hentai)");
    }

    async execute(data: CommandData) {
        const api = new NHentai();
        const hentai = await api.random(false);
        await data.msg.channel.send(new MessageEmbed()
            .setTitle(hentai.cleanTitle)
            .setThumbnail(hentai.cover)
            .setURL(hentai.url)
            .addField("tags", this.tagParse(hentai.tags.tags, "tag"), true)
            .addFields(
                {name: "author", value: "" + this.validator(hentai.tags.artists, "artist"), inline: false},
                {name: "characters", value: "" + this.validator(hentai.tags.characters, "character"), inline: false},
                {name: "genre", value: "" + this.validator(hentai.tags.categories, "category"), inline: false},
                {name: "language", value: "" + this.validator(hentai.tags.languages, "language"), inline: false},
                {name: "parodies", value: "" + this.validator(hentai.tags.parodies, "parody"), inline: false},
            )
            .setColor("#cd52f2")
        )
    }

    tagParse(hentaiTags: Tag[] , types: string) {
        let tags: string = "";
        for (const hentaitag of hentaiTags) {
            tags += `[\`${hentaitag.name}\`](https://nhentai.net/${types}/${hentaitag.name.replace(/ /g,"-")}) `;
        }
        return tags
    }


    validator(hentai: Tag[], type: string) {
        if (hentai == null || "" || undefined || hentai.length <= 0) {
            return "`" + "none" + "`";
        } else if (Array.isArray(hentai)) {
            return this.tagParse(hentai, type);
        }
    }

}

export default meep