import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children?: ReactNode;
}

interface PreloadProps {
  as: string;
  hrefs: string[];
}

export const Head = (props: Props) => ReactDOM.createPortal(props.children, document.head);

export const Preload = ({ hrefs, as }: PreloadProps) => (
  <Head>
    {hrefs.map(src => (
      <link rel="preload" href={src} as={as} />
    ))}
  </Head>
);
