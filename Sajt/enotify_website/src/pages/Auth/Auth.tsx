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
import React, { useEffect, useState } from "react";

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
    if (!val && value.length > 0) {
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
  useEffect(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const interBubble = document.querySelector(".interactive");
      let curX = 0;
      let curY = 0;
      let tgX = 0;
      let tgY = 0;

      function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(
          curX
        )}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(() => {
          move();
        });
      }

      window.addEventListener("mousemove", (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
      });

      move();
    });
  }, []);

  return (
    <EuiProvider colorMode="light">
      <EuiPageTemplate panelled={panelled}>
        <EuiGlobalToastList
          toasts={toasts}
          toastLifeTimeMs={6000}
          dismissToast={removeToast}
        />

        <div className="auth">
          <div className="loginPanelLeft">
            <img src="./bell.png" alt="logo" />
            <EuiFieldPassword
              placeholder="Šifra"
              type="dual"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            <button className="loginBtn" onClick={handleLogin}>
              Ulogujte se
            </button>
          </div>
          <div className="loginPanelRight">
            <img src="./logoBigDark.png" alt="logo" />
            <h1>Ulogujte se</h1>
            <p>
              Ulogujte se na nalog vaše škole kako biste pristupili svim
              resursima i informacijama koje su vam potrebni za uspešno vođenje
              vaše škole.
            </p>
            <img src="./books.png"></img>
          </div>
        </div>
        <div className="container">
          <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="10"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>
          <div className="gradient-container">
            <div className="grad-1 grad"></div>
            <div className="grad-2 grad"></div>
            <div className="grad-3 grad"></div>
            <div className="grad-4 grad"></div>
            <div className="grad-5 grad"></div>
            <div className="interactive"></div>
          </div>
        </div>
      </EuiPageTemplate>
    </EuiProvider>
  );
}

export default Auth;
