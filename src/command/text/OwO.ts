import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";

class OwO extends Command {
    constructor() {
        super("owo", ["OwO"], "uwu owo", Group.misc, "^(owo/OwO)");
    }

    async execute(data: CommandData) {
        try {
            await data.msg.react('😳');
            await data.msg.react('👉');
            await data.msg.react('👈');
        } catch (error) {
            //als het fout gaat geef ik een message terug
            console.error('One of the emojis failed to react.');
            await data.msg.channel.send('One of the emojis failed to react.');
        }
    }
}

export default OwO