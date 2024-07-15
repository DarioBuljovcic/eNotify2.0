import {
  EuiButton,
  EuiFieldPassword,
  EuiFieldText,
  EuiFlexGrid,
  EuiFlexItem,
  EuiFormLabel,
  EuiGlobalToastList,
  EuiPageBody,
  EuiPageHeader,
  EuiPageTemplate,
  EuiPageTemplateProps,
  EuiProvider,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import React, { useState } from "react";

function Auth({ Login }) {
  const panelled: EuiPageTemplateProps["panelled"] = true;
  const [value, setValue] = useState("");
  const [toasts, setToasts] = useState([]);
  const [toastId, setToastId] = useState(0);
  const removeToast = (removedToast) => {
    setToasts((toasts) =>
      toasts.filter((toast) => toast.id !== removedToast.id)
    );
  };
  const handleLogin = async () => {
    let toast;
    const val = await Login(value);
    if (!val) {
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            <p>Šifra nije dobra!</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      setValue("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <EuiProvider colorMode="light">
      <EuiPageTemplate panelled={panelled}>
        <EuiGlobalToastList
          toasts={toasts}
          toastLifeTimeMs={6000}
          dismissToast={removeToast}
        />
        <EuiPageBody
          paddingSize="m"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <EuiPageTemplate.Section grow={false} alignment="center">
            <EuiFlexGrid>
              <EuiFlexItem>
                <EuiTitle>
                  <EuiText textAlign="center">Login</EuiText>
                </EuiTitle>
                <EuiText size="s" textAlign="center">
                  Ulogujte se na nalog vaše škole
                </EuiText>
              </EuiFlexItem>
              <EuiSpacer />

              <EuiFlexItem>
                <EuiFieldPassword
                  placeholder="Šifra"
                  type="dual"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
              </EuiFlexItem>

              <EuiSpacer />
              <EuiFlexItem>
                <EuiButton onClick={() => handleLogin()}>Ulogujte se</EuiButton>
              </EuiFlexItem>
            </EuiFlexGrid>
          </EuiPageTemplate.Section>
        </EuiPageBody>
      </EuiPageTemplate>
    </EuiProvider>
  );
}

export default Auth;
