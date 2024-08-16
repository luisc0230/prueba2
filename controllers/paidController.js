const express = require ('express');
const axios = require('axios');
const router = express.Router();
const keys = require("../keys/keys");
const hmacSHA256 = require('crypto-js/hmac-sha256');
const Hex = require('crypto-js/enc-hex');
const util = require('util');
const fs = require('fs');
const crypto = require('crypto');
const controller = {};

const username = keys.username;
const passwordRedirect = keys.passwordRedirect;

controller.home = (req, res) => {
    res.send('Servidor Node.js en funcionamiento sin frontend');
}

controller.urlFlutter = (req, res) => {

    const email = req.body['email'];
    const amount = req.body['amount'];
    const currency = req.body['currency'];
    const mode = req.body['mode'];
    const language = req.body['language'];
    const orderId = req.body['orderId'];

    const params = {
        vads_action_mode: 'INTERACTIVE',
        vads_amount: amount,
        vads_ctx_mode: mode,
        vads_currency: currency,
        vads_cust_email: email,
        vads_page_action: 'PAYMENT',
        vads_payment_config: 'SINGLE',
        vads_site_id: username,
        vads_url_cancel: 'https://webview_' + username + '.cancel',
        vads_url_error: 'https://webview_' + username + '.error',
        vads_url_refused: 'https://webview_' + username + '.refused',
        vads_url_return: 'https://webview_' + username + '.return',
        vads_url_success: 'https://webview_' + username + '.success',
        vads_return_mode: 'GET',
        vads_trans_date: new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14),
        vads_trans_id: ((Math.floor(Date.now() / 1000)) % 1000000).toString(),
        vads_version: 'V2',
        vads_order_id: orderId,
        vads_language: language,
        vads_redirect_success_timeout: 5
      };
      
    params.signature = getSignature(params, passwordRedirect);
    
    axios.post('https://secure.micuentaweb.pe/vads-payment/entry.silentInit.a', new URLSearchParams(params))
    .then(response => {
        const responseData = response.data;
        if (responseData.redirect_url) {
            res.status(200).send({'redirectionUrl' : responseData.redirect_url })
        } else {
            res.status(500)
        }
    })
    .catch(error => {
        console.error('Error en la comunicación con la pasarela de pago:', error);
    });

}

function getSignature(params, key) {
    let contentSignature = '';
  
    const sortedParams = Object.keys(params).sort().reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});
  
    for (const name in sortedParams) {
      if (name.startsWith('vads_')) {
        contentSignature += sortedParams[name] + '+';
      }
    }
  
    contentSignature += key;
  
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(contentSignature, 'utf8');
    const signature = hmac.digest('base64');
  
    return signature;
}

controller.ipn = (req, res) => {
  const signature = req.body['signature'];

  if (signature == getSignature(req.body, passwordRedirect)){
    res.status(200).send({'response' : req.body['vads_result'] })
  }else {
    res.status(500).send( {'response' : 'Es probable un intento de fraude'})
  }
}

module.exports = controller;