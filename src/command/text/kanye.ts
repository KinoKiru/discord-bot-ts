import Command, {CommandData} from "../../model/command";
import fetch from "node-fetch";
import Group from "../../model/group";

class kanye extends Command {
    constructor() {
        super("kanye", [], "Kanyes wisdom he shares with you!", Group.misc, "^kanye");
    }

    async execute(data: CommandData) {
        fetch("https://api.kanye.rest/")
            .then(res => res.json())
            .then(body => data.msg.channel.send("> *Kanye*: " + body.quote));
    }
}

export default kanye