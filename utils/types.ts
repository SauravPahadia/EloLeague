import {SessionBase} from "next-auth/_utils";

export interface SessionObj extends SessionBase {
    userId: number,
    tier: "free" | "individual" | "club",
    numAllowedLeagues: number,
    trialUsed: boolean,
}

export interface UserObj {
    id: number,
    email: string,
    name: string,
    leagues: number[],
    tier: "free" | "individual" | "club",
    num_leagues_allowed: number,
    trial_used: boolean,
}

export interface LeagueObj {
    id: number,
    user_id: number,
    name: string,
    url_name: string,
    code: string,
    description?: string,
    players?: string[],
}

export interface GameObj {
    id: number,
    league_id: number,
    player1: string,
    player2: string,
    score1: number,
    score2: number,
    elo1_before: number,
    elo2_before: number,
    elo1_after: number,
    elo2_after: number,
    date: string,
    winner: string, 
    loser: string
}

export interface PlayerStandingObj {
    name: string,
    rating: number,
    wins: number, // this should eventually be count but for now it's broken
    losses: number, // same as above
}