import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import mangaScraper from "../../util/mangaScraper";


class Manga extends Command {
    constructor() {
        super("manga", [], "returnes your manga", Group.misc, "^manga <name,chapter>");
    }

    async execute(data: CommandData) {
        try {
            let manga = await mangaScraper.getManga(data);
        } catch (e){
            console.log(e);
        }


    }
}


export default Manga