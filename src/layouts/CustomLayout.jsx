import { Link } from "react-router-dom";
import "../assets/scss/layouts/custom-layout.scss";
import { useSelector } from "react-redux";
import uiDifferentLanguageData from "../assets/json/uiDifferentLanguageData.json";

export default function CustomLayout(props) {
  const language = useSelector((state) => state.app.settings.language);

  return (
    <div className="custom-layout">
      <section className="custom-layout__top">
        <Link to="/">
          <div className="custom-layout__cancel">
            <svg
              className="custom-layout__cancel-arrow"
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="21"
              viewBox="0 0 13 21"
            >
              <path
                d="M0.80127 10.8916C0.80127 11.2734 0.947266 11.5991 1.25049 11.8911L10.0103 20.46C10.2461 20.707 10.5605 20.8306 10.9199 20.8306C11.6499 20.8306 12.2227 20.269 12.2227 19.5278C12.2227 19.1685 12.0767 18.8428 11.8296 18.5957L3.93457 10.8916L11.8296 3.1875C12.0767 2.9292 12.2227 2.60352 12.2227 2.24414C12.2227 1.51416 11.6499 0.952637 10.9199 0.952637C10.5605 0.952637 10.2461 1.07617 10.0103 1.32324L1.25049 9.89209C0.947266 10.1841 0.8125 10.5098 0.80127 10.8916Z"
                fill="black"
              />
            </svg>
            <span className="custom-layout__cancel-text">
              {
                uiDifferentLanguageData[language].layouts.custom_layout
                  .cancel_text
              }
            </span>
          </div>
        </Link>
      </section>

      {props.children}

      <div className="custom-layout__ellipse-1"></div>
      <div className="custom-layout__ellipse-2"></div>
    </div>
  );
}
