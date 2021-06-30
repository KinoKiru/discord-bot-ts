import Command, {CommandData} from "../../model/command";
import Group from "../../model/group";
import fetch from "node-fetch";
import {MessageEmbed} from "discord.js";


class Weather extends Command {
    constructor() {
        super("weather", ["w"], "Sends you the weather forecast", Group.misc, "^(w, weather)");
    }

    async execute(data: CommandData) {

        if (data.args[0] == null || "" || undefined) {
            await data.msg.channel.send("Please give a valid location");
            return;
        }

        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${data.args[0]}&appid=${process.env.weatherID}&units=metric`);
        let result = await response.json();

        let sunrise = new Date(result.sys.sunrise * 1000).toTimeString().split(" ")[0];
        let sunset = new Date(result.sys.sunset * 1000).toTimeString().split(" ")[0];

        sunrise = sunrise.slice(0, sunrise.lastIndexOf(":"));
        sunset = sunset.slice(0, sunset.lastIndexOf(":"));

        await data.msg.channel.send(new MessageEmbed()
            .setTitle("Weather forecast: " + result.name)
            .addFields(
                {
                    name: "stats",
                    value: result.weather[0].main + "\n" + "temperature: " + Math.floor(result.main.temp).toFixed(0) + " °C" + "\n" +
                        "Sunrise: " + sunrise + " am" + "\n" +
                        "Sunset: " + sunset + " pm"
                }
            )
            .setThumbnail(`https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`)
            .setColor("#43c458")
        )
    }
}

export default Weather