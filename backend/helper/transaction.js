const axios = require('axios');
const TonWeb = require('tonweb');

const History = require('../models/PurchaseHistory');
const { VERIFY_TRANSACTION_ON_MAINNET, OWNER_ADDRESS } = require('./constants');

const bocToHash = async (boc) => {
    try {
        const bytes = await TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(boc)).hash();
        const hash = TonWeb.utils.bytesToHex(bytes);
        return hash;
    } catch (err) {
        console.log('Boc to hash error:', err.message);
        return null;
    }
}

const addressHexToBase64 = (hexAddress, isTestOnly = !VERIFY_TRANSACTION_ON_MAINNET) => {
    const address = new TonWeb.utils.Address(hexAddress);
    return address.toString(true, true, false, isTestOnly);
}

const verifyTransaction = async (tx, requiredAmount) => {
    const hash = await bocToHash(tx.boc);
    console.log('Hash:', hash);

    if (!hash) return { success: false, msg: 'Invalid transaction.' }

    try {
        const history = await History.findOne({ hash });
        if (history) return { success: false, msg: 'Already exist.'};

        const { data } = await axios.get(`https://${ VERIFY_TRANSACTION_ON_MAINNET ? '' : 'testnet.' }tonapi.io/v2/events/` + hash);
        for (let i = 0; i < data.actions.length; i++) {
            if (data.actions[i].status !== "ok") return { success: false, msg: 'Transaction failed.' };
        }

        if (data.actions[0].type !== 'TonTransfer') return { success: false, msg: 'No ton transfer transaction'};
        if (data.actions[0].TonTransfer.amount < requiredAmount * 1e9) return { success: false, msg: 'Not enough transfer amount' };

        const from = addressHexToBase64(data.actions[0].TonTransfer.sender.address);
        const to = addressHexToBase64(data.actions[0].TonTransfer.recipient.address);

        if (addressHexToBase64(data.actions[0].TonTransfer.recipient.address, false) != OWNER_ADDRESS) return { success: false, msg: 'Not transferred to owner.' };
        const amount = data.actions[0].TonTransfer.amount / 1e9;

        return { success: true, hash, from, to, amount };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            msg: err.message
        }
    }
}

module.exports = { verifyTransaction }