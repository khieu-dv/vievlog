import * as Colyseus from "colyseus.js";
import OnlinePlayer from "../game/OnlinePlayer";

// Array with current online players
export const onlinePlayers: Record<string, OnlinePlayer> = {};

// Colyseus connection with server
const client = new Colyseus.Client('ws://localhost:3005');

export interface Room {
    sessionId: string;
    name: string;
    // Add other properties/methods from Colyseus.Room as needed
}

export interface JoinError extends Error {
    // Extend with additional properties if needed
}

export const room: Promise<Room> = client.joinOrCreate<unknown>("poke_world").then((room: Room) => {
    console.log(room.sessionId, "joined", room.name);
    return room;
}).catch((e: JoinError) => {
    console.log("JOIN ERROR", e);
    throw e;
});