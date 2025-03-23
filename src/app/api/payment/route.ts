import crypto from 'crypto';

const paymentParameters = {
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    orderInfo: 'pay with MoMo',
    partnerCode: 'MOMO',
    redirectUrl: 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b',
    ipnUrl: 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b',
    requestType: "payWithMethod",
    amount: '50000',
    orderId: 'MOMO' + new Date().getTime(),
    requestId: 'MOMO' + new Date().getTime(),
    extraData: '',
    paymentCode: '',
    orderGroupId: '',
    autoCapture: true,
    lang: 'vi',
};
const rawSignature = 
    `accessKey=${paymentParameters.accessKey
    }&amount=${paymentParameters.amount
    }&extraData=${paymentParameters.extraData
    }&ipnUrl=${paymentParameters.ipnUrl
    }&orderId=${paymentParameters.orderId
    }&orderInfo=${paymentParameters.orderInfo
    }&partnerCode=${paymentParameters.partnerCode
    }&redirectUrl=${paymentParameters.redirectUrl
    }&requestId=${paymentParameters.requestId
    }&requestType=${paymentParameters.requestType
    }`;
const signature = crypto.createHmac('sha256', paymentParameters.secretKey).update(rawSignature).digest('hex')
const requestBody = JSON.stringify({
    partnerCode: paymentParameters.partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: paymentParameters.requestId,
    amount: paymentParameters.amount,
    orderId: paymentParameters.orderId,
    orderInfo: paymentParameters.orderInfo,
    redirectUrl: paymentParameters.redirectUrl,
    ipnUrl: paymentParameters.ipnUrl,
    lang: paymentParameters.lang,
    requestType: paymentParameters.requestType,
    autoCapture: paymentParameters.autoCapture,
    extraData: paymentParameters.extraData,
    orderGroupId: paymentParameters.orderGroupId,
    signature: signature
});
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody).toString()
    },
    port: 443,
}

const POST = async (request: Request) => {
    try {
    const res = await fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
        ...options,
        body: requestBody
    })
    const data = await res.json()
    return new Response(JSON.stringify(data))
    } catch (error) {
    return new Response(JSON.stringify(error))
        
    }
}

export { POST }
