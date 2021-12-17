import React from "react";

import "./App.scss";
import generate from "./util";
import logo from "./logo.png";
import questionsData from "./questions.json"
import answers from "./answerData.json"
import countryCodes from "./countryCodes.json"
import QuestionCard from "./QuestionCard";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      questionNum: 0,
      questions: [],
      score: 0,
    };
  }

  componentDidMount() {
    this.setState({
      questions: generate(10),
    });
  }
  
  render() {
    const {questionNum, questions, score} = this.state;
    return (
      <div className="container">
        {questionNum <= 1 ? <div className={`transBox ${questionNum > 0 ? "left" : ""}`}>
          <div className="title">
            <h1>Test your <img src={logo} alt="CQ"/></h1>
            <div className="desc">Find out your Cultural Intelligence (CQ). Quiz generated from 2017-2021 <a href="https://www.worldvaluessurvey.org/" target="_blank" rel="noreferrer">World Value Survey</a> data.</div>
            <button onClick={() => this.setState({questionNum: 1})}>Go <span className="material-icons">chevron_right</span></button>
          </div>
        </div> : null}
        {questions.map((q, i) => 
          questionNum <= i + 2 && questionNum >= i ? <QuestionCard
            right={questionNum < i + 1}
            left={questionNum > i + 1}
            key={i}
            question={q}
            incrementScore={() => this.setState({score: score + 1})}
            onNextClick={() => this.setState({questionNum: questionNum + 1})}
          /> : null  
        )}
        <div className={`score ${questionNum === 0 ? "bottom" : ""} ${questionNum === 11 ? "scoreEnd" : ""}`}>
          <div className="inner">
            SCORE:&nbsp;<b>{score}</b>&nbsp;<span>/ 10</span>
            <button className={`${questionNum === 11 ? "" : "collapsed"}`} onClick={() => window.location.reload()}>Play again?</button>
          </div>
        </div>
        <div className="permaHome">
          <a href="https://jothedev.com"><span className="material-icons">chevron_left</span>&nbsp;<span className="material-icons">home</span></a>
        </div>
      </div>
    );
  }
}