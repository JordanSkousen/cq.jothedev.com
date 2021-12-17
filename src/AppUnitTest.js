import React from "react";

import "./css/flag-icons.css";
import generate, {noDuplicates, flagSVG} from "./util";
import questionsData from "./questions.json"
import answers from "./answerData.json"
import countryCodes from "./countryCodes.json"
import countryCodeMapping from "./countryCodeMapping.json";
import countryCodeMapping2Char from "./countryCodeMapping2Char.json";

function DisplayCountryCode(code) {
  return <div style={{fontSize: 25}}>{flagSVG(code)}{countryCodeMapping[code] || "Unknown"}</div>;
}

export default class AppUnitTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      questionNum: 0,
      countries: [],
    }
  }

  componentDidMount() {
    this.setState({
      questions: generate(-1).map(q => q.title),
    });
  }

  render() {
    const {questions, countries} = this.state;

    return (<div style={{background: "white"}}>
      <h1>Correct answer countries</h1>
      {noDuplicates(answers
        .map(a => a.HighestCountries
          .map(c => c.CountryNum)
          .concat(a.LowestCountries.map(c => c.CountryNum)
          )
        )
      ).map(c => DisplayCountryCode(c))}
      <h1>Possible countries</h1>
      {countryCodes.map(c => <div>{DisplayCountryCode(c)} ({c})</div>)}
      <h1>Total questions: {questions.length}</h1>
      {questions.map(q => <h2>{q}.</h2>)}
    </div>)
  }
  
}