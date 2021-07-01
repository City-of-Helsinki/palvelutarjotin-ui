import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import * as React from 'react';

import useResetState from '../../../hooks/useResetState';

const MESSAGE_DISPLAY_TIME = 4000; // 4s

type ButtonProps = JSX.IntrinsicElements['button'];

export interface CopyButtonProps extends ButtonProps {
  string: string;
  successClass?: string;
  successMessage: React.ReactNode;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  string,
  successClass = 'success',
  successMessage,
  ...rest
}) => {
  const [isShowCopySuccess, setIsShowCopySuccess] = useResetState(
    false,
    MESSAGE_DISPLAY_TIME
  );

  const handleButtonClick = () => {
    copy(string);
    setIsShowCopySuccess(true);
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        {...rest}
        className={classNames(rest.className, {
          [successClass]: isShowCopySuccess,
        })}
      />
      {isShowCopySuccess && successMessage}
    </>
  );
};

export default CopyButton;
