import midtransConfig from 'midtrans-client';

const midtrans = new midtransConfig.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT
});

export default midtrans