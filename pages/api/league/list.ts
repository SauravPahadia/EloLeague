import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {createClient} from "@supabase/supabase-js";
import {LeagueObj} from "../../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check method
    if (req.method !== "GET") return res.status(405).json({message: "Invalid request method"});

    // check params
    if (!req.query.userId) return res.status(406).json({message: "Missing user ID"});

    // check auth
    const session = await getSession({req});
    if (!session) return res.status(403).json({message: "You must be logged in to view your leagues."});

    // check url_name uniqueness
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const {data: leagues, error: _} = await supabase
        .from<LeagueObj>("Leagues")
        .select("*")
        .eq("user_id", req.query.userId);

    return res.status(200).json(leagues);
}