import NextAuth, {InitOptions} from "next-auth";
import Providers from "next-auth/providers";
import {NextApiRequest, NextApiResponse} from "next";
import {SessionObj, UserObj} from "../../../utils/types";
import {createClient} from "@supabase/supabase-js";

const options: InitOptions = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        session: async (session, user) => {
            const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

            const {data: userRecords, error: _} = await supabase
                .from<UserObj>('Users')
                .select("*")
                .eq("email", user.email);

            let userRecord: UserObj;

            if (!userRecords || userRecords.length === 0) {
                const {data: newUser, error} = await supabase
                    .from<UserObj>('Users')
                    .insert([
                        {
                            email: user.email,
                            name: user.name,
                        },
                    ]);
                userRecord = newUser[0];
            } else {
                userRecord = userRecords[0]
            }

            let newSession: SessionObj = {
                userId: userRecord.id,
                tier: userRecord.tier,
                numAllowedLeagues: userRecord.num_leagues_allowed,
                ...session,
            };

            return newSession;
        }
    }
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
