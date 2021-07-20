import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import LyricScraper from "../../util/lyricScraper";
import {queue} from "../../bot";
import {MessageEmbed} from "discord.js";

class Lyrics extends Command {
    constructor() {
        super("lyrics", ["l"], "Gives you the lyrics of a song", Group.music, "^(lyrics/l)");
    }

    async execute(data: CommandData) {
        let serverQueue = queue.get(data.msg.guild!.id)!;
        let title = serverQueue.songs[0].title.replace(/\*|"|:|music|video|official|vevo|hq|]|feat.|full album|featuring|ft.|\(|\)|\[|{|}|「|」|-/gi, ' ');
        let artist = serverQueue.songs[0].artist?.replace(/\*|"|:|-/g, '') || "";

        let instance = new LyricScraper();
        let response = await instance.Scaper(artist + " " + title);
        await data.msg.channel.send(new MessageEmbed()
            .setDescription(response)
            .setTitle(title.replace(/ +/g, " "))
            .setAuthor(artist)
            .setColor("#800869")
        )
    }
}

export default Lyrics