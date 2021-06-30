import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import fetch from "node-fetch";
import {MessageEmbed} from "discord.js";
import Volume from "../music/volume";

const genders = require("../../util/gender");


class UserTester extends Command {
    constructor() {
        super("identity", ["id"], "shows your true gender and age", Group.misc, "^(id, identity)");
    }

    async execute(data: CommandData) {

        if (data.args.length == 0) {
            let response = await fetch(`https://api.genderize.io?name=${data.msg.author.username}`);
            let result = await response.json();
            let ageResponse = await fetch(`https://api.agify.io?name=${data.msg.author.username}`);
            let ageResult = await ageResponse.json();

            this.genderValidator(result);
            this.ageValidator(ageResult);

            await data.msg.channel.send(new MessageEmbed()
                .addFields(
                    {name: "Information", value: "Gender: " + result.gender + "\n Age: " + ageResult.age}
                ).setColor("#fc6203")
            )
        } else {

            let response = await fetch(`https://api.genderize.io?name=${data.args[0]}`)
            let result = await response.json();
            let nameResponse = await fetch(`https://api.agify.io?name=${data.args[0]}`)
            let ageResult = await nameResponse.json();


            this.genderValidator(result);
            this.ageValidator(ageResult)

            await data.msg.channel.send(new MessageEmbed()
                .addFields(
                    {name: "Gender", value: "Gender: " + result.gender + "\n Age: " + ageResult.age}
                ).setColor("#fc6203")
            )
        }
    }

    genderValidator(result: any) {
        if (result.gender === null) {
            result.gender = genders[Math.floor(Math.random() * genders.length)];
            return result.gender
        }
    }

    ageValidator(result: any) {
        if (result.age === null) {
            result.age = Math.floor((Math.random() * 100) + 1);
            return result.age;
        }
    }

}

export default UserTester