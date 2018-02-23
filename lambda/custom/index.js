'use strict';
const Alexa = require('alexa-sdk');
var Db = require('./db.js')
var db = new Db();
var _ = require('lodash');
var languageStrings = require('./resourceStrings');
var constants = require('./constants');

//Make sure to enclose your value in quotes, like this:  const APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
const APP_ID = "amzn1.ask.skill.b128a952-0622-4b06-b8a8-487a0f1e2fa9";

const states = {
  START: "_START",
  QUIZ: "_QUIZ"
};

const handlers = {
  "LaunchRequest": function() {
    this.handler.state = states.START;
    this.emitWithState("Start");
  },
  "QuizIntent": function() {
    this.handler.state = states.QUIZ;
    this.emitWithState("Quiz");
  },
  "AnswerIntent": function() {
    this.handler.state = states.START;
    this.emitWithState("AnswerIntent");
  },
  "AMAZON.HelpIntent": function() {
    this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
    this.emit(":responseReady");
  },
  "Unhandled": function() {
    this.handler.state = states.START;
    this.emitWithState("Start");
  }
};

const startHandlers = Alexa.CreateStateHandler(states.START,{
  "Start": function() {
    console.log('In Start state')
    db.available_mythologies((err, data) => {
      console.log("@@@err, data", err, data)
      if (err) {
        console.log('error in getting mythologies', err);
        this.emit(":tell", this.t("SYSTEM_ERROR"));
      } else if (!_.isNull(data) || !_.isEmpty(data) || !_.isUndefined(data)) {
        console.log("##data=", data)
        var mythologies = "";
        for (var i=0; i<data.length; i++) {
          mythologies += data[i].name + ",";
        }

        let output = "";
        console.log('##',this.attributes);
        if (!_.has(this.attributes, "quizscore")) {
          output = this.t("WELCOME_MESSAGE") + this.t("CHOICE_QUESTION", mythologies)
        } else {
          output = this.t("CHOICE_QUESTION", mythologies)
        }

        console.log('@@output=',output);
        this.emit(":ask", output);
      }
    });
  },
  "RamayanaIntent": function() {
    console.log("Got response from user for:")
    this.attributes["choice"] = "Ramayana";
    this.handler.state = states.QUIZ;
    this.emitWithState("Quiz");
  },
  "MahabharathaIntent": function() {
    console.log("Got response from user for:")
    this.attributes["choice"] = "Mahabharata";
    this.handler.state = states.QUIZ;
    this.emitWithState("Quiz");
  },
  "BhagavataIntent": function() {
    console.log("Got response from user for:")
    this.attributes["choice"] = "Bhagavata";
    this.handler.state = states.QUIZ;
    this.emitWithState("Quiz");
  },
  "QuizIntent": function() {
    this.handler.state = states.QUIZ;
    this.emitWithState("Quiz");
  },
  "AMAZON.PauseIntent": function() {
    this.emit(":responseReady", this.t("EXIT_SKILL_MESSAGE"))
  },
  "AMAZON.StopIntent": function() {
    console.log('@In stop intent')
    this.emit(":tell", this.t("EXIT_SKILL_MESSAGE"))
  },
  "AMAZON.CancelIntent": function() {
    this.emit(":responseReady", this.t("EXIT_SKILL_MESSAGE"))
  },
  "AMAZON.HelpIntent": function() {
    this.emit(":responseReady", this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
  },
  "Unhandled": function() {
    this.emitWithState("Start");
  }
});

const quizHandlers = Alexa.CreateStateHandler(states.QUIZ,{
  "Quiz": function() {
    db.count(this.attributes["choice"], (err, totalQuestions) => {
      if (err) {
        console.log('error in getting count of questions for ' + this.attributes["choice"], err)
        this.emit(":tell", this.t("SYSTEM_ERROR"));
      } else {
        console.log('Setting initial params');
        this.attributes["total"] = totalQuestions;  //total number of questions to ask from
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["quizscore"] = 0;
        this.attributes["quizitem"] = {};
        this.emitWithState("AskQuestion");
      }
    })
  },
  "AskQuestion": function() {
    console.log('question asking...', this.attributes)
    if (_.isEqual(this.attributes["counter"], 0)) {
      this.attributes["response"] = this.t("START_QUIZ_MESSAGE", constants.TOTAL_QUESTIONS, this.attributes["choice"]) + " ";
    } else {
      this.attributes["response"] += this.t("NEXT_QUESTION_PREFIX")
    }

    let random = getRandom(1, this.attributes["total"]);
    db.question(this.attributes["choice"], random, (err, item) => {
      console.log('got a question...')
      if (err) {
        console.log('error in getting question:', err);
        this.emit(":tell", this.t("SYSTEM_ERROR"));
      } else {
        var type = item.Type;
        var question_suffix = "";
        if (_.isEqual(type, "TF")) {
          question_suffix = this.t("QUESTION_TRUE_FALSE_SUFFIX");
        } else if (_.isEqual(type, "Optional")) {
          question_suffix = this.t("QUESTION_OPTIONS_SUFFIX") + item.Responses
        }
        let question = this.attributes["response"] + item.Question + "." + question_suffix;
        this.attributes["quizitem"] = item;
        this.attributes["quizitem"].Question = question;
        this.attributes["counter"] += 1;
        this.emit(":ask", question);
      }
    })
  },
  "AnswersIntent": function() {
    let response = "";
    let speechOutput = "";
    let item = this.attributes["quizitem"];

    if (!_.has(this.event.request, 'intent.slots')) {
      this.emit(":ask", this.t("ASK_TO_REPEAT"));
    }
    let correct = verifyAnswer(this.event.request.intent.slots, item.Answer);
    if (correct) {
      console.log('##constructing correct response..')
      let correctResponses = this.t("CORRECT_RESPONSES")
      response = "<say-as interpret-as='interjection'>" + correctResponses[getRandom(0, correctResponses.length-1)] + "! </say-as><break strength='strong'/>";

      this.attributes["quizscore"]++;
    } else {
      console.log('##constructing in-correct response......')
      let inCorrectResponses = this.t("INCORRECT_RESPONSES")
      response = "<say-as interpret-as='interjection'>" + inCorrectResponses[getRandom(0, inCorrectResponses.length-1)] + " </say-as><break strength='strong'/>";
      response += this.t("CORRECT_ANSWER", item.Answer)
    }

    if (this.attributes["counter"] < constants.TOTAL_QUESTIONS) {
      this.attributes["response"] = response;
      // this.response.speak(response);
      this.emitWithState("AskQuestion");
    } else {
      response += this.t("FINAL_SCORE", this.attributes["quizscore"], this.attributes["counter"]);
      speechOutput = response + " " + this.t("PLAY_AGAIN");

      this.emit(":ask", speechOutput);
    }
  },
  "AMAZON.RepeatIntent": function() {
    let quizitem = this.attributes["quizitem"];
    let question = quizitem.Question;
    this.emit(":ask", question);
  },
  "AMAZON.StartOverIntent": function() {
    this.emitWithState("Quiz");
  },
  "AMAZON.StopIntent": function() {
    this.emit(":responseReady", this.t("EXIT_SKILL_MESSAGE"))
  },
  "AMAZON.PauseIntent": function() {
    this.emit(":responseReady", this.t("EXIT_SKILL_MESSAGE"))
  },
  "AMAZON.CancelIntent": function() {
    this.emit(":responseReady", this.t("EXIT_SKILL_MESSAGE"))
  },
  "AMAZON.HelpIntent": function() {
    this.emit(":responseReady", this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
  },
  "AMAZON.YesIntent": function() {
    this.handler.state = states.START;
    this.emitWithState("Start");
  },
  "AMAZON.NoIntent": function() {
    this.emit(":tell", this.t("EXIT_SKILL_MESSAGE"))
  },
  "Unhandled": function() {
    this.emitWithState("AnswerIntent");
  }
});

function verifyAnswer(slot, quizitem) {
  let answer = slot.answers.value;
  if (!_.isUndefined(answer)) {
    var stringSimilarity = require('string-similarity');
    let similarity = stringSimilarity.compareTwoStrings(answer.toString().toLowerCase(), quizitem.toString().toLowerCase());
    console.log('@@',answer.toString().toLowerCase(), quizitem.toString().toLowerCase(), similarity);

    if (similarity >= 0.7) {
      return true
    }
  }

  return false;
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max-min+1)+min);
}

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = constants.APP_ID;
  // alexa.dynamoDBTableName = constants.DYNAMO_SESSION_TABLE;
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers, startHandlers, quizHandlers);
  alexa.execute();
};
