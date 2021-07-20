import Command, {CommandData} from "../../model/command";
import {MessageEmbed} from "discord.js";
import Group from "../../model/group";

class userInfo extends Command {
    constructor() {
        super("userinfo", ["ui"], "Gives you user data", Group.misc, "!(ui/userinfo)")
    }

    async execute(data: CommandData) {
        await data.msg.channel.send(new MessageEmbed()
            .setTitle("User Information")
            .addField('Username', data.msg.author.username) //als je een derde parameter mee geeft de true gaat hij op dezelfde line
            .addField('Creation date', data.msg.author.createdAt.getDate() + "-" + (data.msg.author.createdAt.getMonth() + 1) + '-' + data.msg.author.createdAt.getFullYear())
            .addField("User ID", data.msg.author.id)
            .addField('Current server', data.msg.guild?.name)
            .setColor("0xF1C40F")
            .setThumbnail(data.msg.author.avatarURL()!)
        )
    }
}

export default userInfo