import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import fetch from "node-fetch";
import {MessageEmbed} from "discord.js";


class ChuckNorris extends Command{
    constructor() {
        super("chuck", [], "chuck norris joke", Group.misc, "^chuck");
    }
   async execute(data: CommandData) {
         let response = await fetch("https://api.chucknorris.io/jokes/random");
         let jsonResponse = await response.json();
         await data.msg.channel.send(new MessageEmbed()
             .setThumbnail(jsonResponse.icon_url)
             .setTitle("Chuck's chuckle")
             .setURL(jsonResponse.url)
             .setDescription(jsonResponse.value)
         );
    }
}

export default ChuckNorris