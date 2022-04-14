var crypto = require('crypto');
var Secp256k1 = require('@enumatech/secp256k1-js');
const { COINMODE_URI } = require('../util/CONSTANTS');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getAdvert(_user_id){
    var res = await fetch(`http://localhost:5000/api/v1/advert/request?userID=${_user_id}`);
    var json = await res.json();
    return json;
}

// POST: TRANSFER FUNDS GET FEES
async function transferFundsGetFees(_play_token, _to_type, _payment_amount, _user_id){
    var jsonPayload = JSON.stringify({
        play_token: _play_token,
        to_type: _to_type,
        to: _user_id,
        amount: _payment_amount
    });
    var res = await fetch(`${COINMODE_URI}/v1/players/wallet/transfer_funds/get_fees`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: jsonPayload
    });
    var json = await res.json();
    if(json.hasOwnProperty("status")){
        if(json.status === "ok") return true;
        else return new Error("Failed");
    } else return new Error("Failed");
}

// POST: TRANSFER FUNDS REQUEST
async function transferFundsRequest(_play_token, _to_type, _payment_amount, _user_id){
    var jsonPayload = JSON.stringify({
        play_token: _play_token,
        to_type: _to_type,
        to: _user_id,
        amount: _payment_amount,
        description_for_sender: "ADVERT",
        description_for_reciever: "MONEY FOR WATCHING ADVERT",
        description_for_coinmode: "advert",
    });
    var res = await fetch(`${COINMODE_URI}/v1/players/wallet/transfer_funds/request`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: jsonPayload
    });
    var json = await res.json();
    if(json.hasOwnProperty("status")){
        if(json.status === "ok") return json.payment_pending_id;
        else return new Error("Failed");
    } else return new Error("Request Incorrect");
}

// POST: TRANSFER FUNDS VERIFY
async function transferFundsVerify(_play_token, _pending_payment_id){
    var jsonPayload = JSON.stringify({
        play_token: _play_token,
        pending_payment_id: _pending_payment_id
    });
    var res = await fetch(`${COINMODE_URI}/v1/players/wallet/transfer_funds/verify`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: jsonPayload
    });
    var json = await res.json();
    if(json.hasOwnProperty("status")){
        if(json.status === "ok") return true;
        else return new Error("Funds Verify Failed");
    }
}

module.exports.transferFundsGetFees = transferFundsGetFees;
module.exports.transferFundsRequest = transferFundsRequest;
module.exports.transferFundsVerify = transferFundsVerify;
module.exports.getAdvert = getAdvert;