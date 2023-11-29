import "../../../assets/scss/components/forecast-details.scss";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import moveLineToTarget from "../../../utils/moveLineToTarget";
import ForecastItem from "./ForecastItem";
import UVIndex from "./UVIndex";
import Sunrise from "./Sunrise";
import Wind from "./Wind";
import Rainfall from "./Rainfall";
import FeelsLike from "./FeelsLike";
import Humidity from "./Humidity";
import Pressure from "./Pressure";
import uiDifferentLanguageData from "../../../assets/json/uiDifferentLanguageData.json";
import { FORECAST_TYPES } from "../../../utils/types";
import { searchPlaceBuyName } from "../../../features/forecast/forecastSlice";
import getCurrentDayFromPlace from "../../../utils/getCurrentDayFromPlace";
import Sceleton from "../../App/Sceleton";

const FULLSCREEN_MODE_ACTIVATION_POSITION_Y = 100;
// const POSITION_X = -50;
// const DECREASABLE_VALUE_FOR_POSITON_Y_DEFAULT_MODE = 317;
// const POSITION_Y_FULLSCREEN_MODE = 147;

export default function ForecastDetails(props) {
  const forecastFirstButtonRef = useRef(null);
  const forecastSecondButtonRef = useRef(null);
  const movableLineRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const forecastItemsRef = useRef(null);

  const apiDataIsLoaded = useSelector((state) => state.forecast.dataIsLoaded);
  const language = useSelector((state) => state.settings.language);
  const locationName = useSelector((state) => state.location.name);
  const currentPlace = useSelector((state) =>
    searchPlaceBuyName(state, locationName)
  );

  const [currentForecastType, setCurrentForecastType] = useState(
    FORECAST_TYPES.HOURLY
  );
  const [dragButtonTouchStartPosition, setDragButtonTouchStartPosition] =
    useState({ x: 0, y: 0 });

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);

    moveLineToTarget(movableLineRef.current, forecastFirstButtonRef.current);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  function onWindowResize() {
    if (currentForecastType === FORECAST_TYPES.HOURLY) {
      moveLineToTarget(movableLineRef.current, forecastFirstButtonRef.current);
    } else {
      moveLineToTarget(movableLineRef.current, forecastSecondButtonRef.current);
    }
  }

  function onForecastButtonClick(event, forecastType) {
    moveLineToTarget(movableLineRef.current, event.target);

    setCurrentForecastType(forecastType);
  }

  function onForecastItemsWheel(event) {
    forecastItemsRef.current.scrollLeft += event.deltaY;
  }

  function dragButtonOnTouchStart(event) {
    setDragButtonTouchStartPosition({
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    });
  }

  function dragButtonOnTouchMove(event) {
    if (
      dragButtonTouchStartPosition.y - event.touches[0].pageY >=
      FULLSCREEN_MODE_ACTIVATION_POSITION_Y
    ) {
      if (props.mainFullscreenMode) {
        return;
      }

      activateFullscreenMode();
    }
  }

  function activateFullscreenMode() {
    props.setMainFullscreenMode(true);

    activateScrollOfScrollWrapper();
  }

  function disableFullscreenMode() {
    props.setMainFullscreenMode(false);

    scrollWrapperRef.current.style.height = "auto";
  }

  function activateScrollOfScrollWrapper() {
    if (!props.mainFullscreenMode) {
      return;
    }

    const scrollWrapperRect = scrollWrapperRef.current.getBoundingClientRect();
    scrollWrapperRef.current.style.height =
      window.innerHeight - scrollWrapperRect.top + "px";
  }

  return (
    <div
      className={
        "forecast-details" +
        (props.mainFullscreenMode ? " forecast-details_fullscreen" : "")
      }
      onTransitionEnd={activateScrollOfScrollWrapper}
    >
      <div className="forecast-details__top-bar">
        <button
          onTouchStart={dragButtonOnTouchStart}
          onTouchMove={dragButtonOnTouchMove}
          onClick={disableFullscreenMode}
          className="forecast-details__drag-button"
        ></button>
        <button
          ref={forecastFirstButtonRef}
          onClick={(event) =>
            onForecastButtonClick(event, FORECAST_TYPES.HOURLY)
          }
          className="forecast-details__forecast-button"
        >
          {
            uiDifferentLanguageData[language].components.main_weather_details
              .hourly_forecast
          }
        </button>
        <button
          ref={forecastSecondButtonRef}
          onClick={(event) =>
            onForecastButtonClick(event, FORECAST_TYPES.WEEKLY)
          }
          className="forecast-details__forecast-button"
        >
          {
            uiDifferentLanguageData[language].components.main_weather_details
              .weekly_forecast
          }
        </button>
        <div
          ref={movableLineRef}
          className="forecast-details__movable-line"
        ></div>
      </div>

      <div ref={scrollWrapperRef} className="forecast-details__scroll-wrapper">
        <div
          ref={forecastItemsRef}
          onWheel={onForecastItemsWheel}
          className="forecast-details__forecast-items"
        >
          {apiDataIsLoaded ? (
            <>
              {currentForecastType === FORECAST_TYPES.HOURLY
                ? getCurrentDayFromPlace(currentPlace).forecastOfHours.map(
                    (hour, idx) => (
                      <ForecastItem
                        key={idx}
                        apiDataIsLoaded={apiDataIsLoaded}
                        language={language}
                        date={hour.time}
                        forecastType={currentForecastType}
                        conditionCode={hour.conditionCode}
                        isDay={hour.isDay}
                        temperature={Math.floor(hour.temperature)}
                      />
                    )
                  )
                : currentPlace.forecastOfDays.map((day, idx) => (
                    <ForecastItem
                      key={idx}
                      apiDataIsLoaded={apiDataIsLoaded}
                      language={language}
                      date={day.date}
                      forecastType={currentForecastType}
                      conditionCode={day.conditionCode}
                      isDay={true}
                      temperature={Math.floor(day.avgTemperature)}
                    />
                  ))}
            </>
          ) : (
            <div className="forecast-details__center">
              <Sceleton width={"90%"} height={"146px"} borderRadius={"20px"} />
            </div>
          )}
        </div>

        <div className="forecast-details__container">
          <UVIndex
            apiDataIsLoaded={apiDataIsLoaded}
            language={language}
            currentPlace={currentPlace}
          />

          <div className="forecast-details__container-inner">
            <Sunrise
              apiDataIsLoaded={apiDataIsLoaded}
              language={language}
              currentPlace={currentPlace}
            />
            <Wind
              apiDataIsLoaded={apiDataIsLoaded}
              language={language}
              currentPlace={currentPlace}
            />
            <Rainfall
              apiDataIsLoaded={apiDataIsLoaded}
              language={language}
              currentPlace={currentPlace}
            />
            <FeelsLike
              apiDataIsLoaded={apiDataIsLoaded}
              language={language}
              currentPlace={currentPlace}
            />
            <Humidity
              apiDataIsLoaded={apiDataIsLoaded}
              language={language}
              currentPlace={currentPlace}
            />
            <Pressure
              apiDataIsLoaded={apiDataIsLoaded}
              language={language}
              currentPlace={currentPlace}
            />
          </div>
        </div>
      </div>

      <div className="forecast-details__ellipse-1"></div>
      <div className="forecast-details__ellipse-2"></div>
      <div className="forecast-details__ellipse-3"></div>
    </div>
  );
}