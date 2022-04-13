var crypto = require('crypto');
var assert = require('assert');
var Secp256k1 = require('@enumatech/secp256k1-js');
const { COINMODE_URI } = require('../util/CONSTANTS');

async function addPublicKey(_user_id){
    // generating private key
    const private_key = Secp256k1.uint256(crypto.randomBytes(32), 16);
    // save private key to db
    //
    // Generating public key
    const public_key = Secp256k1.generatePublicKeyFromPrivateKeyData(private_key)
    const b64_public_key = public_key.toString('base64');

    var res = await fetch(`${COINMODE_URI}/v1/players/keys/add/request`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            play_token: process.env.play_token,
            public_key: b64_public_key
        })
    });
    var json = await res.json();
    if(json.ok) return true;
    else return false;
}