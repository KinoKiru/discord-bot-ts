import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";

class zaad extends Command{
  async execute(data: CommandData) {
        await data.msg.channel.send("Cool maar je moeder is dik");
    }
    constructor() {
        super("zaad", [],"je moeder", Group.misc,"!zaad");
    }
}

export default zaad;