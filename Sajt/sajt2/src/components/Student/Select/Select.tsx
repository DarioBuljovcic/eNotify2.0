import React, { useState, useEffect, useRef } from "react";
import "./css/select.css";

type SelectOption = {
  Class: string;
};

type SelectProps = {
  options: SelectOption[];
  value: SelectOption;
  onChange: (value: SelectOption) => void;
};

export function Select({ value, onChange, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);

  function clearOptions() {
    onChange({Class:""});
  }
  function selectOption(option: SelectOption) {
    if (value===option) {
      onChange({Class:""});
    } else {

       onChange(option);
    }
  }
  function isOpenSelected(option: SelectOption) {
    return value===option;
  }
  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
    if (highlighterRef.current) {
      highlighterRef.current.style.opacity = `100%`;
      highlighterRef.current.style.top = `${0 * 1.85}em`;
    }
  }, [isOpen]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space": {
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        }

        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (listRef.current) {
            const scrollValue = listRef.current.scrollHeight / options.length;
            listRef.current.scrollTop = Math.min(
              listRef.current.scrollHeight,
              Math.max(
                0,
                listRef.current.scrollTop +
                  (e.code === "ArrowDown" ? scrollValue : -scrollValue)
              )
            );
          }

          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
      }
    };
    containerRef.current?.addEventListener("keydown", handler);
    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);
  return (
    <>
      <div
        ref={containerRef}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        className="container"
      >
        <span className="value">
          {value.Class!='' && value.Class   
          }
        </span>
        <button
          className="clear-btn"
          onClick={(e) => {
            e.stopPropagation();
            clearOptions();
          }}
        >
          &times;
        </button>
        <div className="divider"></div>
        <div className={`caret ${isOpen ? "open" : ""}`}></div>
        <ul ref={listRef} className={`options ${isOpen ? "show" : ""}`}>
          <div className="highlighter" ref={highlighterRef}></div>
          {options.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => {
                setHighlightedIndex(index);
                if (highlighterRef.current) {
                  highlighterRef.current.style.opacity = `100%`;
                  highlighterRef.current.style.top = `${index * 1.85}em`;
                }
              }}
              onMouseLeave={() => {
                setHighlightedIndex(-1);
                if (highlighterRef.current)
                  highlighterRef.current.style.opacity = `0`;
              }}
              key={option.Class}
              className={`option ${isOpenSelected(option) ? "selected" : ""} ${
                highlightedIndex === index ? "highlighted" : ""
              } `}
            >
              {option.Class}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
