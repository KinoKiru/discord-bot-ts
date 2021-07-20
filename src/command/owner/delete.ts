import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import {DMChannel} from "discord.js";
import AppendError from "../../util/appendError";

class Delete extends Command {
    constructor() {
        super("delete", ["dx"], "Delete messages", Group.owner, "^(d/delete)<Integer>1 - 100");
    }

    async execute(data: CommandData) {
        try {
            //als de message komt van de owner kan hij verder
            if (data.msg.author.id === process.env.userId) {
                if (!data.args[0]) {
                    await data.msg.reply('Please enter the amount of messages to clear!');
                } else if (isNaN(+data.args[0])) {
                    await data.msg.reply('Please type a real number!');
                } else if (+data.args[0] > 100) {
                    await data.msg.reply('You can\'t remove more than 100 messages!');
                } else if (+data.args[0] < 1) {
                    await data.msg.reply('You have to delete at least one message!');
                } else {
                    //hij fetch de messages die niet ouder zijn dan 2 weken dan geeft hij de limit erop die is meeggeven en dan bulk delete ik die messages
                    // @ts-ignore
                    await data.msg.channel.messages.fetch({limit: data.args[0]}).then(messages => {
                        if (!(data.msg.channel instanceof DMChannel)) {
                            // @ts-ignore
                            data.msg.channel.bulkDelete(messages)
                        }
                    });
                }
            } else {
                await data.msg.channel.send("You dont have the rights to preform this action.")
            }
        } catch (error) {
            AppendError.onError(error + " " + "Delete.ts")
        }
    }
}

export default Delete