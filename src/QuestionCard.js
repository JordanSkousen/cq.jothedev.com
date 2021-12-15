import React from "react";

import "./css/flag-icons.css";
import "./QuestionCard.scss";
import countryCodeMapping from "./countryCodeMapping.json";
import countryCodeMapping2Char from "./countryCodeMapping2Char.json";

const letters = ["A", "B", "C", "D"];
function Option(props) {
  return (<>
    <button onClick={props.onClick}>
      <b>{letters[props.index]}. </b> {props.children}
    </button>
  </>);
}

export default function QuestionCard({left, right, question, incrementScore, onNextClick}) {
  const [chosenOption, setChosenOption] = React.useState(0);
  const {low, num, title, choices, correctAnswer, topFive} = question;
  const correctOption = choices.indexOf(correctAnswer) + 1;
  return (<>
    <div className={`transBox ${chosenOption > 0 ? "flip" : ""} ${right ? "right" : ""} ${left ? "left" : ""}`}>
      <div className="question">
        <h2 className="intro">Which country had the most people agree with the following:</h2>
        <h2><b>Q{num}. </b> {title}.</h2>
        <div className="buttonGrid">
          {choices.map((choice, i) => <Option index={i} onClick={() => {
            setChosenOption(i + 1);
            if (correctAnswer === choice) {
              incrementScore();
            }
          }}>{DisplayCountryCode(choice)}</Option>)}
        </div>
      </div>
    </div>
    {chosenOption > 0 ? <div className={`transBox ${chosenOption > 0 ? "backsideFlip" : ""} ${right ? "right" : ""} ${left ? "left" : ""} backside`}>
      <div className={`question questionBack ${chosenOption === correctOption ? "green" : "red"}`}>
        <h3>ANSWER TO #<b>{num}</b></h3>
        
        <div className="questionQuote"><span className="quote">&quot;</span>{title}.<span className="quote">&quot;</span></div>
        <h2>
          <b>{letters[correctOption - 1]}. </b> {DisplayCountryCode(correctAnswer)}
        </h2>
        <div className="exp">
          The top 5 average responses to this question were ({low ? "lower average is higher ranking" : "higher average is higher ranking"}):
          {topFive.map(tf => <p><span className="country">{DisplayCountryCode(tf?.CountryNum)}</span> - <span className="countryScore">{Round(tf?.Average, 3)}</span></p>)}
        </div>
        <div className="spacer"></div>
        <div className="next">
          <button onClick={() => onNextClick()}>Next <span class="material-icons">chevron_right</span></button>
        </div>
      </div>
    </div> : null}
  </>);
}

function DisplayCountryCode(code) {
  return <span className="countryItem"><span className={`flag-icon flag-icon-${countryCodeMapping2Char[code]?.toLowerCase() || "xx"}`}></span> {countryCodeMapping[code] || "Unknown"}</span>;
}

function Round(num, to) {
  return Math.round(num * Math.pow(10, to)) / Math.pow(10, to);
}