import "./initDb.ts";
import { Coward, Message, Guild } from "./deps.ts";
import { config } from "./config.ts";
import { resolveCommand } from "./commands/index.ts";
import { checkIfSomethingToSend } from "./checkIfSomethingToSend.ts";
import { registerChannels } from "./registerChannels.ts";

export const client = new Coward(config.token);

export const upSince = Date.now();

setInterval(() => {
  checkIfSomethingToSend();
}, 1000);


client.evtMessageCreate.attach(({message}) => {
    resolveCommand(message);
})

client.evtGuildCreate.attach(({guild}) => {
    registerChannels(guild.channels, guild.id)
})

client.connect();
