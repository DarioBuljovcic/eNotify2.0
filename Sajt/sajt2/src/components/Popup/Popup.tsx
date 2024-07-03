// src/components/ConfirmationDialog.tsx
import React, { useEffect, useState } from 'react';
import './css/style.css';

interface ConfirmationDialogProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  confirmText?: string;
  cancelText?: string;
  showBtns:boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  isOpen,
  confirmText = "Da",
  cancelText = "Ne",
  showBtns = true
}) => {
  const [animationClass, setAnimationClass] = useState<string>('exit');
  const [animationClassOuter, setAnimationClassOuter] = useState<string>('exit');
  const [shouldRender, setShouldRender] = useState<boolean>(isOpen);

  useEffect(() => {
    if (isOpen) {
        setShouldRender(true);
        
        setTimeout(() => {
            setAnimationClass('enter');
            setAnimationClassOuter('enter');
        }, 100);
    } else {
      setAnimationClass('exit');
      setAnimationClassOuter('exit');
      setShouldRender(false);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setAnimationClass('hidden');
      
    }
  };
  const handleCancel = ()=>{
    onCancel();
    setTimeout(() => {
        setShouldRender(false);
    }, 200);
  }
  const handleConfirm = ()=>{
    onConfirm();
    setTimeout(() => {
        setShouldRender(false);
    }, 200);
  }
  const Btns = ()=>{
    if(showBtns){
    return  <>
                <button onClick={handleConfirm} className="confirm-button">{confirmText}</button>
                <button onClick={handleCancel} className="cancel-button">{cancelText}</button>
            </>
    }else{
        return <button onClick={onConfirm} className="confirm-button">Okej</button>
    }
  }

  return (
    <div
      className={`confirmation-dialog-overlay ${!shouldRender ? 'hidden' : ''} ${animationClassOuter}`}
      
    >
      <div className={`confirmation-dialog ${animationClass}`} onAnimationEnd={handleAnimationEnd}>
        <p>{message}</p>
        <div className="confirmation-dialog-buttons">
            {Btns()}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;