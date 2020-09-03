import React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

interface Props {
  children: React.ReactNode;
  isFocused: boolean;
  className?: string;
  scrollIntoViewOptions?: ScrollIntoViewOptions;
}

const ScrollIntoViewWithFocus: React.FC<Props> = ({
  children,
  isFocused,
  className,
  scrollIntoViewOptions = { block: 'nearest', inline: 'nearest' },
}) => {
  const selfRef = React.useRef<HTMLDivElement | null>(null);

  useDeepCompareEffect(() => {
    if (isFocused) {
      // jsdom doesn't support scrollIntoView
      selfRef.current?.scrollIntoView?.(scrollIntoViewOptions);
    }
  }, [isFocused, scrollIntoViewOptions]);

  return (
    <div ref={selfRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollIntoViewWithFocus;
