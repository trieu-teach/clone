import { zOrderDetailSchemaUdate } from '@/schemas/orderDetailSchema';
import { zOrderSchemaUdate } from '@/schemas/orderSchema';
import crypto from 'crypto';
import moment from 'moment';
import mongoose from 'mongoose';


const config = {
    app_id: process.env.ZALOPAY_APP_ID || '2553',
    key1: process.env.ZALOPAY_KEY1 ||'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: process.env.ZALOPAY_KEY2 ||'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: process.env.ZALOPAY_ENDPOINT ||"https://sandbox.zalopay.vn/v2/create",
};




const POST = async (request: Request) => {
    const reqData = await request.json()
    const orderId = reqData.orderId;
    const orderParsed = zOrderSchemaUdate.parse({ ...reqData.order, _id: new mongoose.Types.ObjectId(orderId) });
    const orderDetailParsed = reqData.orderDetail.map((item: any) => {
        return zOrderDetailSchemaUdate.parse({
            ...item,
            _id: new mongoose.Types.ObjectId(item._id),
            order_id: new mongoose.Types.ObjectId(item.orderId),
            product_id: new mongoose.Types.ObjectId(item.product_id),
        })
    });

    const items = orderDetailParsed;
    const transID = orderParsed._id.toString();
    const embed_data = {
        //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
        redirecturl: (process.env.NGROK_BASE_URL||`https://23f1-14-226-225-128.ngrok-free.app/`) +orderParsed._id.toString()+"/invoice",
    };

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: orderParsed.customer_id.toString(),
        app_time: Date.now().toString(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: (orderParsed.final_amount).toString(),
        description: `Skincare - Payment for the order #${transID}`,
        callback_url: (process.env.NGROK_BASE_URL||`https://23f1-14-226-225-128.ngrok-free.app/`)+'api/payment/callback',
        bank_code: '',
        mac: '',
    };
    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex')

    // Build the query string
    const queryString = new URLSearchParams(order).toString();
    const urlWithParams = `${config.endpoint}?${queryString}`;
    try {

        const res = await fetch(urlWithParams, {
            method: 'POST', // ZaloPay API requires POST even with query parameters
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Important: Set the correct content type
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('ZaloPay API error:', errorData);
            return new Response(JSON.stringify({ error: 'ZaloPay API request failed', details: errorData }), { status: res.status });
        }

        const responseData = await res.json();
        return new Response(JSON.stringify(responseData), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error', details: error }), { status: 500 });
    }
};

export { POST };
