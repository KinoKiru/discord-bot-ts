import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {queue} from "../../seks";
import {SongType} from "../../util/sfdl";
import fetch from "node-fetch";
import {MessageEmbed} from "discord.js";


class Lyrics extends Command {
    constructor() {
        super("lyrics", ["l"], "Gives the lyrics of the currrent song", Group.music, "^(lyrics/l)");
    }

    async execute(data: CommandData) {
        let serverQueue = queue.get(data.msg.guild?.id);


        if (!data.msg.member?.voice.channel) {
            await data.msg.channel.send(
                "You have to be in a voice channel to display lyrics!"
            );
            return;
        }

        //als er nog geen serverqueue bestaat of dat er geen liedjes zijn dan leaved ie en geeft hij een message aan de user
        if (!serverQueue || serverQueue.songs.length === 0) {
            data.msg.member.voice.channel.leave();
            await data.msg.channel.send("There is no lyrics i can display");
            return;
        }
        console.log(serverQueue.songs[0]);
        if (serverQueue.songs[0].type === SongType.SPOTIFY) {

            let response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(serverQueue.songs[0].artist)}/${encodeURIComponent(serverQueue.songs[0].title)}`);
            let result = await response.json();

            await data.msg.channel.send(new MessageEmbed()
                .setTitle(`Lyrics of:  ${serverQueue.songs[0].title}`)
                .addField("lyrics", result.lyrics)
            )
        }

    }
}

export default Lyrics