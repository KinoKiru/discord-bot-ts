import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import fetch from "node-fetch";
import {MessageEmbed} from "discord.js";

class Bijbl extends Command {
    constructor() {
        super("verse", [], "Gives you a verse", Group.misc, "^verse");
    }

    async execute(data: CommandData) {
        let response = await fetch("https://devotionalium.com/api/v2");
        let result = await response.json();
        await data.msg.channel!.send(new MessageEmbed()
            .setTitle(result[0].book)
            .addField("Verse", result[0].text)
            .setThumbnail(result.photo.url)
            .addFields(
                {
                    name: "Placement",
                    value: `book number: ${result[0].bookNumber} chapter: ${result[0].chapter} verse: ${result[0].startVerse}`
                }
            )
        )
    }
}

export default Bijbl