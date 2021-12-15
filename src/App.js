import React from "react";

import "./App.scss";
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
    const questions = shuffleArray(questionsData.map(q => {
      let arr = [];
      for (let i = q.range[0]; i <= q.range[1]; i++) {
        if (q.low === true) {
          arr.push({num: i, low: true});
        }
        else {
          arr.push({num: i, low: false});
          arr.push({num: i, low: true});
        }
      }
      return arr;
    }).flat()).slice(0, 10);
    this.setState({
      questions: questions.map((question, i) => {
        const questionSchema = questionsData.filter(q => question.num >= q.range[0] && question.num <= q.range[1])[0];
        let questionTitle = questionSchema.template.replace("%LOW_HIGH%", question.low ? questionSchema.low : questionSchema.high);
        if (questionTitle.includes("%i%")) {
          questionTitle = questionTitle.replace("%i%", questionSchema["%i%"][question.num - questionSchema.range[0]]);
        }
        let topFive = answers.filter(a => a.Num === question.num)[0];
        if (question.low) {
          topFive = topFive.LowestCountries;
        }
        else {
          topFive = topFive.HighestCountries;
        }
        const answer = topFive[0].CountryNum;
        return {
          low: question.low,
          num: i + 1,
          title: questionTitle,
          choices: shuffleArray(shuffleArray(countryCodes.filter(code => code !== answer)).slice(0, 3).concat([answer])),
          correctAnswer: answer,
          topFive: topFive,
        };
      }),
    });
  }
  
  render() {
    const {questionNum, questions, score} = this.state;
    return (
      <div className="container">
        <div className={`transBox ${questionNum > 0 ? "left" : ""}`}>
          <div className="title">
            <h1>Test your <img src={logo} alt="CQ"/></h1>
            <div className="desc">Find out your Cultural Intelligence (CQ). Quiz generated from <a href="https://www.worldvaluessurvey.org/" target="_blank" rel="noreferrer">World Value Survey</a> data.</div>
            <button onClick={() => this.setState({questionNum: 1})}>Go <span class="material-icons">chevron_right</span></button>
          </div>
        </div>
        {questions.map((q, i) => 
          <QuestionCard
            right={questionNum < i + 1}
            left={questionNum > i + 1}
            question={q}
            incrementScore={() => this.setState({score: score + 1})}
            onNextClick={() => this.setState({questionNum: questionNum + 1})}
          />  
        )}
        <div className={`score ${questionNum === 0 ? "bottom" : ""} ${questionNum === 11 ? "scoreEnd" : ""}`}>
          <div className="inner">
            SCORE:&nbsp;<b>{score}</b>&nbsp;<span>/ 10</span>
            <button className={`${questionNum === 11 ? "" : "collapsed"}`} onClick={() => window.location.reload()}>Play again?</button>
          </div>
        </div>
      </div>
    );
  }
}

//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}