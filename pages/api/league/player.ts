import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {createClient} from "@supabase/supabase-js";
import {GameObj, LeagueObj} from "../../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check method
    if (req.method !== "POST") return res.status(405).json({message: "Invalid request method"});

    // check for missing fields
    if (!req.body.leagueId) return res.status(406).json({message: "Missing leagueId field"});
    if (!req.body.name) return res.status(406).json({message: "Missing name field"});

    // check auth
    const session = await getSession({req});
    // if they are not logged in and do not have a code, return 403
    if (!session && !req.body.code) return res.status(403).json({message: "You must have an access code or be logged in to create a league."});

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const {data: leagues, error: _} = await supabase
        .from<LeagueObj>("Leagues")
        .select("*")
        .eq("id", req.body.leagueId);
    if (leagues.length === 0) return res.status(404).json({message: "League not found"});
    if (req.body.code && req.body.code !== leagues[0].code) {
        return res.status(403).json({message: "Invalid access code."});
    } else if (leagues[0].user_id !== session.userId) {
        return res.status(403).json({message: "You must be the league admin to create a player without a code."});
    }

    // check uniqueness of player name
    if (leagues[0].players.includes(req.body.name)) return res.status(200).json({notUnique: true});

    // add player name to league players list
    const newPlayers = [...leagues[0].players, req.body.name];

    const {data, error} = await supabase
        .from<LeagueObj>("Leagues")
        .update({ players: newPlayers })
        .eq("id", req.body.leagueId);

    return res.status(200).json({league: data});
}