import {buffer} from "micro";
import {NextApiRequest, NextApiResponse} from "next";
import {createClient} from "@supabase/supabase-js";
import {UserObj} from "../../../utils/types";

const stripe = require("stripe")(process.env.STRIPE_SK);

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const signature = req.headers["stripe-signature"];

    const buf = await buffer(req);

    try {
        const event = stripe.webhooks.constructEvent(
            buf,
            signature,
            process.env.STRIPE_ENDPOINT_SECRET,
        );

        let email;
        let subtotal;
        let tier;
        let customerId;
        let customerObj;
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

        switch (event.type) {
            case "checkout.session.completed":
                email = event.data.object.customer_details.email;
                subtotal = event.data.object.amount_subtotal;
                tier = subtotal === 1000 ? "individual" : "club";

                const {data: userData, error: userError} = await supabase
                    .from<UserObj>("Users")
                    .update({ tier: tier, trial_used: true })
                    .eq("email", email);

                break;
            case "customer.subscription.updated":
                customerId = event.data.object.customer;
                customerObj = await stripe.customers.retrieve(customerId);

                subtotal = event.data.object.items.data[0].plan.amount;
                tier = event.data.object.canceled_at ? "free" : (subtotal === 1000 ? "individual" : "club");

                console.log(event.data.object, subtotal, tier);

                const {data: userUpdateData, error: userUpdateError} = await supabase
                    .from<UserObj>("Users")
                    .update({ tier: tier })
                    .eq("email", customerObj.email);

                break;
            case "customer.subscription.deleted":
                customerId = event.data.object.customer;
                customerObj = await stripe.customers.retrieve(customerId);

                const {data: userDeleteData, error: userDeleteDataError} = await supabase
                    .from<UserObj>("Users")
                    .update({ tier: "free" })
                    .eq("email", customerObj.email);

                break;
        }
    } catch (e) {
        console.log(e.message);
    }

    return res.status(200).send({});
}