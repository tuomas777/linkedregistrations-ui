import jsdom from 'jsdom';
import Document, {
  DocumentProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

const document = new jsdom.JSDOM('<!DOCTYPE html>').window.document;
global.document = document;

class MyDocument extends Document<DocumentProps> {
  render(): React.ReactElement {
    return (
      <Html>
        <Head>
          {Array.from(document.head.getElementsByTagName('style')).map(
            (style, index) => (
              <style key={index} type={style.type}>
                {style.innerHTML}
              </style>
            )
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
