import * as React from 'react';

interface Props {
  as?: 'div' | 'p';
  className?: string;
  text: string;
}

const TextWithLineBreaks: React.FC<Props> = ({
  as: Tag = 'div',
  className,
  text,
}) => {
  return (
    <Tag className={className}>
      {text.split('\n').map((item, index, parts) => {
        return (
          <React.Fragment key={`${item}-${index}`}>
            {item}
            {index < parts.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </Tag>
  );
};

export default TextWithLineBreaks;
