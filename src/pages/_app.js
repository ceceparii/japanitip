import '@/styles/globals.css';
import AlertProvider from '@/contexts/alertContext';
import AlertMessage from '@/components/ui/alertMessage';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
    useEffect(() => {
        const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
        const clientkey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT;

        const script = document.createElement('script');
        script.src = snapScript;
        script.setAttribute('data-client-key', clientkey);
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <AlertProvider>
            <Component {...pageProps} />
            <AlertMessage />
        </AlertProvider>
    );
}
