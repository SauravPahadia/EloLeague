import next, {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import {createClient} from "@supabase/supabase-js";
import {GameObj, LeagueObj} from "../../utils/types";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../../utils/fetcher";
import React from "react";
import Link from "next/link";
import {BiArrowBack} from "react-icons/bi";
import ElH1 from "../../components/ElH1";
import ElH3 from "../../components/ElH3";
import {Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from "recharts";
import {format} from "date-fns";

export default function Player({league, player}: {league: LeagueObj, player: string}) {
    const {data: games, error: gamesError}: responseInterface<GameObj[], any> = useSWR(`/api/game/list?leagueId=${league.id}&player=${player}`, fetcher);
    // earliest games come first
    // if a is less (earlier) than b, a should come first
    let filteredGames = [];

    if (games) {
        games.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return +(new Date(a.date)) - +(new Date(b.date));
        });

        for (let i = 0; i < games.length - 1; i++) {
            let currentGameDate = new Date(games[i].date);
            let nextGameDate = new Date(games[i + 1].date);
            if (currentGameDate.getFullYear() !== nextGameDate.getFullYear() ||
                currentGameDate.getMonth() !== nextGameDate.getMonth() || 
                currentGameDate.getDate() !== nextGameDate.getDate()) {
                    filteredGames.push(games[i])
                }
        }
        filteredGames.push(games[games.length - 1]);
    }

    const chartData = games ? filteredGames.map(game => ({
        rating: game.player1 === player ? game.elo1_after : game.elo2_after,
        date: new Date(game.date).getTime(),
    })) : null;
    
    const uniqueOpponents = games && games
        .map(game => game.player1 === player ? game.player2 : game.player1)
        .filter((thisPlayer, i, a) => i === a.findIndex(d => d === thisPlayer));
    
    const headToHeads = uniqueOpponents && uniqueOpponents.map(opponent => {
        const gamesAgainst = games.filter(game => [game.player1, game.player2].includes(opponent));
        const wins = gamesAgainst.filter(game => game.winner === player).length;
        const losses = gamesAgainst.filter(game => game.loser === player).length;
        return {
            name: opponent,
            wins: wins,
            losses: losses,
        }
    });

    const thClass = "font-normal pb-2 pr-2";
    const tdClass = "py-4 border-b";

    return (
        <div className="max-w-4xl mx-auto px-4">
            <Link href={`/${league.url_name}`}>
                <a className="flex items-center mt-8">
                    <BiArrowBack/>
                    <span className="ml-4">Back to {league.name}</span>
                </a>
            </Link>
            <ElH1>Player: {player}</ElH1>
            <hr className="my-6"/>
            <div className="md:flex -mx-4">
                <div className="md:w-1/2 mx-4 pb-16">
                    <ElH3>Rating history</ElH3>
                    {chartData && (
                        <ResponsiveContainer width="100%" height={400} className="my-8">
                            <LineChart data={chartData}>
                                <XAxis
                                    dataKey="date"
                                    domain={["auto", "auto"]}
                                    name="Date"
                                    tickFormatter={(unixTime) => format(new Date(unixTime), "M/d/yyyy")}
                                    type="number"
                                    style={{opacity: 0.5}}
                                />
                                <YAxis
                                    dataKey="rating"
                                    name="Rating"
                                    tickFormatter={rating => Math.round(+rating).toString()}
                                    domain={[chartData ? Math.min(...chartData.map(d => d.rating)) - 50 : 0, chartData ? Math.max(...chartData.map(d => d.rating)) + 50 : 2000]}
                                    style={{opacity: 0.5}}
                                />
                                <Line type="monotone" dataKey="rating" stroke="#222" activeDot={{ r: 8 }} isAnimationActive={false}/>
                                <Tooltip content={({active, payload, label}) => (
                                    (active && payload && label) ? (
                                        <>
                                            <p>Date: {format(new Date(+label), "M/d/yyyy 'at' h:mm a")}</p>
                                            <p>Rating: {Math.round(+payload[0].value)}</p>
                                        </>
                                    ) : null
                                )}/>
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                    <style dangerouslySetInnerHTML={{__html: `
.recharts-xAxis .recharts-text.recharts-cartesian-axis-tick-value {
    transform: translateY(1rem);
}

.recharts-yAxis .recharts-text.recharts-cartesian-axis-tick-value {
    transform: translateX(-0.5rem);
}
                    `}}/>
                </div>
                <div className="md:w-1/2 mx-4 pb-16">
                    <ElH3>Head to heads</ElH3>
                    <table className="w-full mt-6">
                        <thead className="text-gray-400 text-left border-b-2">
                            <th className={thClass}>Opponent</th>
                            <th className={thClass}>{player}'s wins vs.</th>
                            <th className={thClass}>{player}'s losses vs.</th>
                        </thead>
                        <tbody>
                            {headToHeads && headToHeads.map(opponentObj => (
                                <tr>
                                    {[opponentObj.name, opponentObj.wins || 0, opponentObj.losses || 0].map(stat => (
                                        <td className={tdClass}>
                                            <Link href={`/${league.url_name}/${opponentObj.name}`}><a>
                                                {stat}
                                            </a></Link>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // get user session
    const session = await getSession(context);

    const urlLeague = context.query.league;
    const urlPlayer = context.query.player;

    if (Array.isArray(urlLeague) || Array.isArray(urlPlayer)) {
        return {notFound: true};
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    const {data: thisLeague, error: _} = await supabase
        .from<LeagueObj>("Leagues")
        .select("*")
        .eq("url_name", urlLeague);

    if (thisLeague.length === 0 || !thisLeague[0].players.includes(urlPlayer)) {
        return {notFound: true};
    }

    let returnLeague = {...thisLeague[0]};
    if (!session || returnLeague.user_id !== session.userId) delete returnLeague.code;

    return {props: {league: thisLeague[0], player: urlPlayer}};
};