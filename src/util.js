import questionsData from "./questions.json";
import answers from "./answerData.json";
import countryCodes from "./countryCodes.json";
import countryCodeMapping from "./countryCodeMapping.json";
import countryCodeMapping2Char from "./countryCodeMapping2Char.json";

export default function generate(numOfQuestions) {
  let qs = shuffleArray(questionsData.map(q => 
    new Array(q.range[1] - q.range[0] + 1)
      .fill({})
      .map((_, i) => [{num: i + q.range[0], low: true, schema: q}].concat(q.low === true ? [] : [{num: i + q.range[0], low: false, schema: q}]))
      .flat()
  ).flat());
  if (numOfQuestions > -1) {
    qs = qs.splice(0, numOfQuestions);
  }
  return qs.map((question, i) => {
    const {schema: questionSchema} = question;
    let questionTitle = questionSchema.template
      .replace("%LOW_HIGH%", question.low ? questionSchema.low : questionSchema.high)
      .replace("%LOW%", question.low ? questionSchema.low : "")
      .replace("%HIGH%", question.low ? "" : questionSchema.high);
    if (questionTitle.includes("%i%")) {
      questionTitle = questionTitle.replace("%i%", questionSchema["%i%"][question.num - questionSchema.range[0]]);
    }
    let topFive = answers.filter(a => a.Num === question.num)[0];
    topFive = question.low ? topFive.LowestCountries : topFive.HighestCountries;
    const answer = topFive[0].CountryNum;
    return {
      low: question.low,
      num: i + 1,
      title: questionTitle,
      choices: shuffleArray(shuffleArray(countryCodes.filter(code => code !== answer)).slice(0, 3).concat([answer])),
      correctAnswer: answer,
      topFive,
    };
  });
}

export function flagSVG(code) {
  const charCode = countryCodeMapping2Char[code]?.toLowerCase() || "xx";  
  /*<span className={`flag-icon flag-icon-${countryCodeMapping2Char[code]?.toLowerCase() || "xx"}`}></span>*/
  return <img className="flagSVG"
    src={`https://flagcdn.com/120x90/${charCode}.png`}
    srcset={`https://flagcdn.com/240x180/${charCode}.png 2x`}
    alt={`Flag of ${countryCodeMapping[code] || "(unknown country)"}`}
  />;
}

//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
export function shuffleArray (a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function noDuplicates(arr) {
  return arr.reduce((acc, val) => acc.concat(val.filter(v => !acc.includes(v))), []);
}