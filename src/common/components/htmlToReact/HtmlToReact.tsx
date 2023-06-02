import { Element } from 'domhandler/lib/node';
import createDOMPurify from 'dompurify';
import parse, { DOMNode, domToReact } from 'html-react-parser';
import React, { useMemo } from 'react';

function getIsomorphicDOMPurifier() {
  if (!process.browser) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const { JSDOM } = require('jsdom');
    const window = new JSDOM('').window;

    return createDOMPurify(window);
  }

  return createDOMPurify();
}

type Props = {
  children: string;
  components?: {
    p?: React.ComponentType<{ children: React.ReactNode }>;
  };
};

const DefaultP = ({ children }: { children: React.ReactNode }) => (
  <p>{children}</p>
);

const HtmlToReact: React.FC<Props> = ({
  children: dirty,
  components: { p: P = DefaultP } = {},
}) => {
  const sanitizedHtml = useMemo(
    () => getIsomorphicDOMPurifier().sanitize(dirty),
    [dirty]
  );

  return (
    <>
      {parse(sanitizedHtml, {
        replace: (domNode) => {
          if (domNode instanceof Element && domNode.name === 'p') {
            return <P>{domToReact(domNode.children as DOMNode[])}</P>;
          }
          return domNode;
        },
      })}
    </>
  );
};

export default HtmlToReact;
