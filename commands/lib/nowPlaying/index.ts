import { Message } from "../../../deps.ts";
import { getSpotifyTokens } from "./spotifyTokens.ts";
import { getCurrenyPlayingSong } from "./getCurrentPlayingSong.ts";
import { getNpChannel } from "../../../registerChannels.ts";
import { sendMessage } from "../../../helpers/sendMessage.ts";
import { client } from "../../../index.ts";

export const nowPlayingHere = async (ctx: Message) => {
    await nowPlaying(ctx, true)
}

export const nowPlaying = async (ctx: Message, replySameChannel: boolean) => {
    const { author, content } = ctx;

    const username = content.replace(/^!np(h ?| ?)/, "") || author.username;

    const guildId = client.channelGuildIDs.get(ctx.channel.id)

    const channelId = !replySameChannel && guildId && getNpChannel(guildId);

    if (!username) {
        return;
    }

    const { access_token, refresh_token } =
        (await getSpotifyTokens(username)) || {};

    if (!access_token || !refresh_token) {
        return;
    }


    
    let res = await getCurrenyPlayingSong(access_token, refresh_token, username);
    
    if (!res) {
        // unknown or not playing anything
        client.createMessage(ctx.channel.id, "Nothing is playin'");
        return;
    }

    if (res.is_playing) {
        // prettier-ignore
        const msg = `🎵 ${username}: ${res.item.artists.map((a: any) => a.name).join(", ")} — ${res.item.name} [${res.item.album.name}] | ${res.item.external_urls.spotify}`

        client.createMessage(channelId || ctx.channel.id, msg)
    }
};
