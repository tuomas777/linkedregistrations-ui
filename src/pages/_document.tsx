import jsdom from 'jsdom';
import Document, {
  DocumentProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../constants';

const documentLang = ({ __NEXT_DATA__ }: DocumentProps): string => {
  const { locale } = __NEXT_DATA__;
  const lang = Object.values(SUPPORTED_LANGUAGES).find((l) => l === locale);

  return lang || DEFAULT_LANGUAGE;
};

const document = new jsdom.JSDOM('<!DOCTYPE html>').window.document;
global.document = document;

class MyDocument extends Document<DocumentProps> {
  render(): React.ReactElement {
    return (
      <Html lang={documentLang(this.props)}>
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
