import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <meta
                    httpEquiv='Content-Security-Policy'
                    content="default-src 'self'; img-src 'self' https://japanitip.vercel.app; font-src 'self'; script-src 'self'; style-src 'self';"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
