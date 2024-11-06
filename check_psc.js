const fetch = require('node-fetch');

const check_psc = async function (cpf) {

    const url = 'https://cloud.certillion.com/css/restful/application/oauth/find-psc-accounts';
    const headers = {
      'Authorization': process.env.CERTILLION_AUTH,
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
      "client_id": process.env.CERTILLION_CLIENT_ID,
      "client_secret": process.env.CERTILLION_CLIENT_SECRET,
      "user_cpf_cnpj": "CPF",
      "val_cpf_cnpj": cpf.replace(/\D/g, '')
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
      });
      const data = await response.json();

      return data;

    } catch (error) {
      console.error('Error:', error);
      throw error;
    }

}

module.exports = { check_psc };