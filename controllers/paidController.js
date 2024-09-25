const express = require('express');
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

    // Imprime el body de la solicitud para verificar los datos recibidos
    console.log("Datos recibidos:", req.body);

    const email = req.body['email'];
    const phone = req.body['phone'];
    const amount = req.body['amount'];
    const currency = req.body['currency'];
    const mode = req.body['mode'];
    const language = req.body['language'];
    const orderId = req.body['orderId'];

    // Asegúrate de que todos los campos requeridos se están recibiendo correctamente
    if (!email || !phone || !amount || !currency || !mode || !language || !orderId) {
        return res.status(400).send("Faltan campos requeridos en la solicitud.");
    }

    const params = {
        vads_action_mode: 'INTERACTIVE',
        vads_amount: amount,
        vads_ctx_mode: mode,
        vads_currency: currency,
        vads_cust_email: email,
        vads_cust_phone: phone,
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
        vads_trans_id: (Date.now() % 1000000).toString().padStart(6, '0'),
        vads_version: 'V2',
        vads_order_id: orderId,
        vads_language: language,
        vads_redirect_success_timeout: 5
    };

    // Generamos la firma (signature)
    params.signature = getSignature(params, passwordRedirect);

    // Realizamos la solicitud a la pasarela de pago
    axios.post('https://secure.micuentaweb.pe/vads-payment/entry.silentInit.a', new URLSearchParams(params))
        .then(response => {
            console.log("Respuesta de la pasarela de pago:", response.data);  // Imprime la respuesta de la pasarela de pago
            const responseData = response.data;
            if (responseData.redirect_url) {
                res.status(200).send({ 'redirectionUrl': responseData.redirect_url });
            } else {
                res.status(500).send("Error al obtener la URL de redirección.");
            }
        })
        .catch(error => {
            console.error('Error en la comunicación con la pasarela de pago:', error.response ? error.response.data : error.message);
            res.status(500).send('Error al comunicarse con la pasarela de pago');
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

    if (signature == getSignature(req.body, passwordRedirect)) {
        res.status(200).send({ 'response': req.body['vads_result'] });
    } else {
        res.status(500).send({ 'response': 'Es probable un intento de fraude' });
    }
}

module.exports = controller;
