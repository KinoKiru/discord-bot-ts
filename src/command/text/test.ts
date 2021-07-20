//dit is een 'test command'
import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";


class Test extends Command {
    constructor() {
        //roept een nieuw command aan
        super("test", ["kut", "hans"], "Ik wil huilen", Group.misc, "!(test/kut/hans)");
    }

    async execute(data: CommandData) {
        await data.msg.channel.send("kut hoer");
    }
}

export default Test;