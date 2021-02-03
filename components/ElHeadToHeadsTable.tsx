import Link from "next/link";
import React from "react";

export default function ElHeadToHeadsTable({headToHeads, player, leagueUrl}: {
    headToHeads: {name: string, wins: number, losses: number}[],
    player: string,
    leagueUrl?: string,
}) {
    const thClass = "font-normal pb-2 pr-2";
    const tdClass = "py-4 border-b";

    return (
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
                            {leagueUrl ? (
                                <Link href={`/${leagueUrl}/${opponentObj.name}`}><a>
                                    {stat}
                                </a></Link>
                            ) : stat}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    )
}