import Command, {CommandData} from "../../model/command";
import {EmbedField, MessageEmbed, MessageReaction} from "discord.js";
import fetch, {RequestInit} from 'node-fetch'
import Group from "../../model/group";

interface Deal {
    "internalName": string,
    "title": string,
    "metacriticLink": string,
    "dealID": string,
    "storeID": string,
    "gameID": string,
    "salePrice": string,
    "normalPrice": string,
    "isOnSale": string,
    "savings": string,
    "metacriticScore": string,
    "steamRatingText": string,
    "steamRatingPercent": string,
    "steamRatingCount": string,
    "steamAppID": string,
    "releaseDate": number,
    "lastChange": number,
    "dealRating": string,
    "thumb": string
}

class Deals extends Command {
    async execute(data: CommandData) {
        await this.startDeals(data);
    }

    constructor() {
        //roept een nieuw command aan
        super("deals", ["d", "games"], "Ik wil huilen", Group.misc, "!(deals/d/games)");
    }

    async startDeals(data: CommandData) {
        try {
            let index = 0
            const deals: Deal[] = await this.getDealsFromPageAsync()
            const stores = await this.getStoresAsync()

            const fields = await this.generateFields(deals, stores)
            let embed = new MessageEmbed()
                .setTitle('Triple A Deals')
                .setThumbnail(deals[index].thumb)
                .addFields(fields[index])

            let sendMessage = await data.msg.channel.send(embed)
            await sendMessage.react('◀️')
            await sendMessage.react('▶️')
            const filter = (reaction: MessageReaction) => {
                return ['◀️', '▶️'].includes(reaction.emoji.name)
            }
            while (true) {
                const collected = await sendMessage.awaitReactions(filter, {max: 1, time: 50000, errors: ['time']})
                const reaction = collected.first()!
                let embed
                if (reaction.emoji.name === '▶️') {
                    index++;
                }
                if (reaction.emoji.name === '◀️' && index > 0) {
                    index--;
                }
                console.log(deals[index]);
                embed = new MessageEmbed()
                    .setTitle('Triple A Deals')
                    .setThumbnail(deals[index].thumb)
                    .setDescription(`Current dealpage ${index}/${fields.length}`)
                    .addFields(fields[index]);
                await sendMessage.edit(embed);
                await sendMessage.reactions.removeAll();
                await sendMessage.react('◀️');
                await sendMessage.react('▶️');
            }
        } catch (error) {
        }
    }

    async generateFields(deals: Deal[], stores: any) {

        let retVal: EmbedField[] = []
        for (const deal of deals) {
            let storeName
            for (const store of stores) {
                if (store.storeID === deal.storeID) {
                    storeName = store.storeName
                }
            }
            retVal.push({
                name: `${deal.title} on ${storeName}`,
                value: `Normal price $${(+deal.normalPrice)}
                 Sale Price $${(+deal.salePrice)}`, inline: false
            })
        }
        return retVal
    }

    async getDealsFromPageAsync() {
        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow'
        };

        const fetchStores = await fetch("https://www.cheapshark.com/api/1.0/deals?AAA=true", requestOptions)
        const jsonReponse = await fetchStores.json()
        return jsonReponse
    }

    async getStoresAsync() {
        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow'
        };

        const fetchStores = await fetch("https://www.cheapshark.com/api/1.0/stores", requestOptions)
        const jsonReponse = await fetchStores.json()
        return jsonReponse
    }
}

export default Deals;