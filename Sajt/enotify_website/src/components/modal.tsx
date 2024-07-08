import { EuiButton, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiSpacer } from '@elastic/eui'
import React from 'react'

function Modal({isOpen,setIsOpen,modalHeader,modalText,modalConfirm,setResult}) {

  const closeModal = ()=>{
      setIsOpen(false);
  }
  const Yes = ()=>{
    setIsOpen(false);
    setResult(true);
  }
  const No = ()=>{
    setIsOpen(false);
    setResult(false);
  }
  const buttons = ()=>{
    if(modalConfirm){
      return <EuiModalFooter>
              <EuiButton onClick={Yes} fill>
                Da
              </EuiButton>
              <EuiButton onClick={No} fill>
                Ne
              </EuiButton>
            </EuiModalFooter>
    }else{
     return <EuiModalFooter>
              <EuiButton onClick={closeModal} fill>
                Spusti
              </EuiButton>
            </EuiModalFooter>
    }
  }
  return (<>
    {isOpen && (
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              {modalHeader}
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            {modalText}
            <EuiSpacer />
            
          </EuiModalBody>
          {
            buttons()
          }
          
        </EuiModal>
      )}
</>)
}

export default Modal
