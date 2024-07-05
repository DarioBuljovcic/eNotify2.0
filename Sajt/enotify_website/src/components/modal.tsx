import { EuiButton, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiSpacer } from '@elastic/eui'
import React from 'react'

function Modal({isOpen,setIsOpen,modalHeader,modalText}) {

    const closeModal = ()=>{
        setIsOpen(false);
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

          <EuiModalFooter>
            <EuiButton onClick={closeModal} fill>
              Spusti
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      )}
</>)
}

export default Modal
