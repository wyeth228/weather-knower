import { useRef, useState } from "react";

export default function RouteTransitionWrapper(props) {
  const thisRef = useRef(null);

  const [transitionStage, setTransitionStage] = useState("fadeIn");

  function onAnimationEnd() {
    if (transitionStage === "fadeOut") {
      setTransitionStage("fadeIn");

      thisRef.current.style.opacity = 0;
    } else {
      thisRef.current.style.opacity = 1;
    }
  }

  return (
    <div
      ref={thisRef}
      className={"route-transition-wrapper " + transitionStage}
      onAnimationEnd={onAnimationEnd}
    >
      {props.children}
    </div>
  );
}
