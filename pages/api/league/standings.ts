// - return an array of players in the league:
// [
// 	{
// 		name: string,
// 		rating: number, // current rating, get from latest game
// 		change: {
// 			24h: number, // rating change over last 24h. Get lastest game before 24h and compare. If doesn't exist then return null
// 			7d: number, // rating change over last 7d
// 			28d: number, // rating change over last 28d
// 		},
// 		wins: number,
// 		losses: number,
// 	}
// ]

import {NextApiRequest, NextApiResponse} from "next";
import {createClient} from "@supabase/supabase-js";
import {GameObj, LeagueObj} from "../../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check method
    if (req.method !== "GET") return res.status(405).json({message: "Invalid request method"});

    // check params
    if (!req.query.leagueId) return res.status(406).json({message: "Missing league ID"});

    // check url_name uniqueness
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const {data: league, error: _} = await supabase
        .from<LeagueObj>("Leagues")
        .select("players")
        .eq("id", req.query.leagueId)
        .single();

    let leagueStandings = [];
    if (league) {
         leagueStandings = await Promise.all(league.players.map(async player => {
            const {data: rating, error: ratingError} = await supabase
                .from<GameObj>("Games")
                .select("elo1_after, elo2_after, player1, player2")
                .eq("league_id", +req.query.leagueId)
                .or(`player1.eq.${player},player2.eq.${player}`)
                .order("date", {ascending: false})
                .limit(1);

            let elo = 1000;
            if (rating.length > 0) {
                const { player1, player2, elo2_after, elo1_after } = rating[0];
                elo = player === player1 ? elo1_after : elo2_after;
            }

            const {data: wins, error: gameWinnerError} = await supabase
                .from<GameObj>("Games")
                .select("*", {count: "exact"})
                .eq("league_id", +req.query.leagueId)
                .eq("winner", player);

            const {data: losses, error: gameLoserError} = await supabase
                .from<GameObj>("Games")
                .select("*", {count: "exact"})
                .eq("league_id", +req.query.leagueId)
                .eq("loser", player);

            return ({
                name: player,
                rating: elo,
                wins: wins.length,
                losses: losses.length,
            });
        }));

         leagueStandings.sort((a, b) => b.rating - a.rating);
    }

    return res.status(200).json(leagueStandings);
}