import { EuiButton, EuiFieldPassword, EuiFieldText, EuiFlexGrid, EuiFlexItem, EuiFormLabel, EuiPageBody, EuiPageHeader, EuiPageTemplate, EuiPageTemplateProps, EuiProvider, EuiSpacer, EuiSwitch, EuiText, EuiTitle } from '@elastic/eui'
import React, { useState } from 'react'

function Auth({Login}) {
    const panelled: EuiPageTemplateProps["panelled"] = true;
    const [value, setValue] = useState('');
    const [dual, setDual] = useState(true);

  return (
    <EuiProvider colorMode="light">
      <EuiPageTemplate panelled={panelled}>
        <EuiPageBody paddingSize="m" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <EuiPageTemplate.Section grow={false} alignment='center'>
                <EuiFlexGrid>
                    <EuiFlexItem>
                        <EuiTitle>
                            <EuiText textAlign='center'>Login</EuiText>
                        </EuiTitle>
                        <EuiText size="s" textAlign='center'>Ulogujte se na nalog vaše škole</EuiText>
                    </EuiFlexItem>
                    <EuiSpacer/>

                    <EuiFlexItem>
                        <EuiFieldPassword
                            placeholder="Šifra"
                            type={dual ? 'dual' : undefined}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            
                        />
                    </EuiFlexItem>
                    
                    <EuiSpacer/>
                    <EuiFlexItem>
                        <EuiButton onClick={()=>Login(value)}>Ulogujte se</EuiButton>
                    </EuiFlexItem>
                   
                </EuiFlexGrid>
                
            </EuiPageTemplate.Section>
        </EuiPageBody>
      </EuiPageTemplate>
    </EuiProvider>
  )
}

export default Auth
