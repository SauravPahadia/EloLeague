import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {makecode} from "../../../utils/makecode";
import {createClient} from "@supabase/supabase-js";
import {LeagueObj} from "../../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check method
    if (req.method !== "POST") return res.status(405).json({message: "Invalid request method"});

    // check for missing fields
    if (!req.body.name) return res.status(406).json({message: "Missing name field"});
    if (!req.body.urlName) return res.status(406).json({message: "Missing urlName field"});

    // check auth
    const session = await getSession({req});
    if (!session) return res.status(403).json({message: "You must be logged in to create a league."});

    // check url_name uniqueness
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const {data: existingLeague, error: _} = await supabase
        .from<LeagueObj>("Leagues")
        .select("*")
        .eq("url_name", req.body.urlName);
    if (existingLeague.length > 0) return res.status(200).json({notUnique: true});

    // create league
    const name = req.body.name;
    const url_name = req.body.urlName;
    const code = makecode();
    const user_id = session.userId;
    const description = req.body.description || "";

    const {data, error} = await supabase
        .from<LeagueObj>("Leagues")
        .insert([
            {
                name: name,
                url_name: url_name,
                code: code,
                user_id: user_id,
                description: description,
            }
        ]);

    console.log(data);

    return res.status(200).json({league: data});
}