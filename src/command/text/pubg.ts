import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";

class pubg extends Command {
    constructor() {
        super("pubg", [], "Je krijgt een mooie video", Group.misc, "^pubg");
    }

    async execute(data: CommandData) {
        await data.msg.channel.send("https://www.youtube.com/watch?v=zLsf8UNmlJc");
    }

}

export default pubg