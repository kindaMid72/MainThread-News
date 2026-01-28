'use client'


import {useEffect, useState} from 'react';


type Props = {
  htmlString: string;
  className?: string;
};

export const HtmlRenderer: React.FC<Props> = ({ htmlString, className }) => {

  const [html, setHtml] = useState(htmlString);

  useEffect(() => { // set lazy loadin for images
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const image = doc.querySelectorAll('img');
    image.forEach((img) => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    })
    setHtml(doc.body.innerHTML);
  }, [htmlString]);

  useEffect(() => { // set target _blank and rel nofollow for links for better SEO
    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');
    const aTag = document.querySelectorAll('a');
    aTag.forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'nofollow');
    })
    setHtml(document.body.innerHTML);
  }, [htmlString]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
};

export default HtmlRenderer;