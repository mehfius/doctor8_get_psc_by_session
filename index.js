const functions = require('@google-cloud/functions-framework');
const { createClient } = require("@supabase/supabase-js");
const cors = require('cors');
const corsMiddleware = cors({ origin: true });
const { check_psc } = require('./check_psc');
functions.http('get_psc_by_session', (req, res) => {
    corsMiddleware(req, res, async () => {
        let session = req.body.data.session;
        const supabase = createClient(process.env.URL, process.env.KEY);
        try {
            
            const { data: data_sessions, error: error_sessions } = await supabase
            .from('sessions')
            .select('users')
            .match({ uuid: session });

            if(!data_sessions) return res.status(400).send("Session inválida");

            const { data: data_users, error: error_users } = await supabase
            .from('users')
            .select('label, cpf')
            .match({ a: true, d: false, id: data_sessions[0].users });

            if(!data_users) return res.status(400).send("User não encontrado");

            let obj = await check_psc(data_users[0].cpf);

            let activePscList = obj.pscs.filter(psc => psc.status === 'S').map(psc => psc.psc);

            const { data: data_users_update, error: error_users_update } = await supabase
            .from('users')
            .update({ psc: activePscList, psc_accounts: obj})
            .match({ id: data_sessions[0].users });

            return res.status(200).send(data_users_update);

        } catch (error) {

            return res.status(500).send(error.message);

        }

    });
});