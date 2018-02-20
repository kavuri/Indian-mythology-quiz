'use strict';
const Alexa = require('alexa-sdk');

//Make sure to enclose your value in quotes, like this:  const APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
const APP_ID = "amzn1.ask.skill.b128a952-0622-4b06-b8a8-487a0f1e2fa9";

//This is the function that returns an answer to your user during the quiz.  Much like the "getQuestion" function above, you can use a
//switch() statement to create different responses for each property in your data.  For example, when this quiz has an answer that includes
//a state abbreviation, we add some SSML to make sure that Alexa spells that abbreviation out (instead of trying to pronounce it.)
function getOptions(property, item)
{
    switch(property)
    {
        case "Abbreviation":
            return "The " + formatCasing(property) + " of " + item.StateName + " is <say-as interpret-as='spell-out'>" + item[property] + "</say-as>. ";
        default:
            return "The " + formatCasing(property) + " of " + item.StateName + " is " + item[property] + ". ";
    }
}

//=========================================================================================================================================
//TODO: Replace this data with your own.
//=========================================================================================================================================
const data = [
                {StateName: "Alabama",        Abbreviation: "AL", Capital: "Montgomery",     StatehoodYear: 1819, StatehoodOrder: 22 },
                {StateName: "Alaska",         Abbreviation: "AK", Capital: "Juneau",         StatehoodYear: 1959, StatehoodOrder: 49 },
                {StateName: "Arizona",        Abbreviation: "AZ", Capital: "Phoenix",        StatehoodYear: 1912, StatehoodOrder: 48 },
                {StateName: "Arkansas",       Abbreviation: "AR", Capital: "Little Rock",    StatehoodYear: 1836, StatehoodOrder: 25 },
                {StateName: "California",     Abbreviation: "CA", Capital: "Sacramento",     StatehoodYear: 1850, StatehoodOrder: 31 },
                {StateName: "Colorado",       Abbreviation: "CO", Capital: "Denver",         StatehoodYear: 1876, StatehoodOrder: 38 },
                {StateName: "Connecticut",    Abbreviation: "CT", Capital: "Hartford",       StatehoodYear: 1788, StatehoodOrder: 5 },
                {StateName: "Delaware",       Abbreviation: "DE", Capital: "Dover",          StatehoodYear: 1787, StatehoodOrder: 1 },
                {StateName: "Florida",        Abbreviation: "FL", Capital: "Tallahassee",    StatehoodYear: 1845, StatehoodOrder: 27 },
                {StateName: "Georgia",        Abbreviation: "GA", Capital: "Atlanta",        StatehoodYear: 1788, StatehoodOrder: 4 },
                {StateName: "Hawaii",         Abbreviation: "HI", Capital: "Honolulu",       StatehoodYear: 1959, StatehoodOrder: 50 },
                {StateName: "Idaho",          Abbreviation: "ID", Capital: "Boise",          StatehoodYear: 1890, StatehoodOrder: 43 },
                {StateName: "Illinois",       Abbreviation: "IL", Capital: "Springfield",    StatehoodYear: 1818, StatehoodOrder: 21 },
                {StateName: "Indiana",        Abbreviation: "IN", Capital: "Indianapolis",   StatehoodYear: 1816, StatehoodOrder: 19 },
                {StateName: "Iowa",           Abbreviation: "IA", Capital: "Des Moines",     StatehoodYear: 1846, StatehoodOrder: 29 },
                {StateName: "Kansas",         Abbreviation: "KS", Capital: "Topeka",         StatehoodYear: 1861, StatehoodOrder: 34 },
                {StateName: "Kentucky",       Abbreviation: "KY", Capital: "Frankfort",      StatehoodYear: 1792, StatehoodOrder: 15 },
                {StateName: "Louisiana",      Abbreviation: "LA", Capital: "Baton Rouge",    StatehoodYear: 1812, StatehoodOrder: 18 },
                {StateName: "Maine",          Abbreviation: "ME", Capital: "Augusta",        StatehoodYear: 1820, StatehoodOrder: 23 },
                {StateName: "Maryland",       Abbreviation: "MD", Capital: "Annapolis",      StatehoodYear: 1788, StatehoodOrder: 7 },
                {StateName: "Massachusetts",  Abbreviation: "MA", Capital: "Boston",         StatehoodYear: 1788, StatehoodOrder: 6 },
                {StateName: "Michigan",       Abbreviation: "MI", Capital: "Lansing",        StatehoodYear: 1837, StatehoodOrder: 26 },
                {StateName: "Minnesota",      Abbreviation: "MN", Capital: "St. Paul",       StatehoodYear: 1858, StatehoodOrder: 32 },
                {StateName: "Mississippi",    Abbreviation: "MS", Capital: "Jackson",        StatehoodYear: 1817, StatehoodOrder: 20 },
                {StateName: "Missouri",       Abbreviation: "MO", Capital: "Jefferson City", StatehoodYear: 1821, StatehoodOrder: 24 },
                {StateName: "Montana",        Abbreviation: "MT", Capital: "Helena",         StatehoodYear: 1889, StatehoodOrder: 41 },
                {StateName: "Nebraska",       Abbreviation: "NE", Capital: "Lincoln",        StatehoodYear: 1867, StatehoodOrder: 37 },
                {StateName: "Nevada",         Abbreviation: "NV", Capital: "Carson City",    StatehoodYear: 1864, StatehoodOrder: 36 },
                {StateName: "New Hampshire",  Abbreviation: "NH", Capital: "Concord",        StatehoodYear: 1788, StatehoodOrder: 9 },
                {StateName: "New Jersey",     Abbreviation: "NJ", Capital: "Trenton",        StatehoodYear: 1787, StatehoodOrder: 3 },
                {StateName: "New Mexico",     Abbreviation: "NM", Capital: "Santa Fe",       StatehoodYear: 1912, StatehoodOrder: 47 },
                {StateName: "New York",       Abbreviation: "NY", Capital: "Albany",         StatehoodYear: 1788, StatehoodOrder: 11 },
                {StateName: "North Carolina", Abbreviation: "NC", Capital: "Raleigh",        StatehoodYear: 1789, StatehoodOrder: 12 },
                {StateName: "North Dakota",   Abbreviation: "ND", Capital: "Bismarck",       StatehoodYear: 1889, StatehoodOrder: 39 },
                {StateName: "Ohio",           Abbreviation: "OH", Capital: "Columbus",       StatehoodYear: 1803, StatehoodOrder: 17 },
                {StateName: "Oklahoma",       Abbreviation: "OK", Capital: "Oklahoma City",  StatehoodYear: 1907, StatehoodOrder: 46 },
                {StateName: "Oregon",         Abbreviation: "OR", Capital: "Salem",          StatehoodYear: 1859, StatehoodOrder: 33 },
                {StateName: "Pennsylvania",   Abbreviation: "PA", Capital: "Harrisburg",     StatehoodYear: 1787, StatehoodOrder: 2 },
                {StateName: "Rhode Island",   Abbreviation: "RI", Capital: "Providence",     StatehoodYear: 1790, StatehoodOrder: 13 },
                {StateName: "South Carolina", Abbreviation: "SC", Capital: "Columbia",       StatehoodYear: 1788, StatehoodOrder: 8 },
                {StateName: "South Dakota",   Abbreviation: "SD", Capital: "Pierre",         StatehoodYear: 1889, StatehoodOrder: 40 },
                {StateName: "Tennessee",      Abbreviation: "TN", Capital: "Nashville",      StatehoodYear: 1796, StatehoodOrder: 16 },
                {StateName: "Texas",          Abbreviation: "TX", Capital: "Austin",         StatehoodYear: 1845, StatehoodOrder: 28 },
                {StateName: "Utah",           Abbreviation: "UT", Capital: "Salt Lake City", StatehoodYear: 1896, StatehoodOrder: 45 },
                {StateName: "Vermont",        Abbreviation: "VT", Capital: "Montpelier",     StatehoodYear: 1791, StatehoodOrder: 14 },
                {StateName: "Virginia",       Abbreviation: "VA", Capital: "Richmond",       StatehoodYear: 1788, StatehoodOrder: 10 },
                {StateName: "Washington",     Abbreviation: "WA", Capital: "Olympia",        StatehoodYear: 1889, StatehoodOrder: 42 },
                {StateName: "West Virginia",  Abbreviation: "WV", Capital: "Charleston",     StatehoodYear: 1863, StatehoodOrder: 35 },
                {StateName: "Wisconsin",      Abbreviation: "WI", Capital: "Madison",        StatehoodYear: 1848, StatehoodOrder: 30 },
                {StateName: "Wyoming",        Abbreviation: "WY", Capital: "Cheyenne",       StatehoodYear: 1890, StatehoodOrder: 44 }
            ];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

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
      this.emit(":ask", this.t("WELCOME_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    "AnswerIntent": function() {
        let item = getItem(this.event.request.intent.slots);

        if (item && item[Object.getOwnPropertyNames(data[0])[0]] != undefined)
        {
          console.log("\nMEMO's TEST\n");
            if (USE_CARDS_FLAG)
            {
                let imageObj = {smallImageUrl: getSmallImage(item), largeImageUrl: getLargeImage(item)};

                this.response.speak(getSpeechDescription(item)).listen(REPROMPT_SPEECH);
            else
            {
                this.response.speak(getSpeechDescription(item)).listen(REPROMPT_SPEECH);
            }
        }
        else
        {
            this.response.speak(getBadAnswer(item)).listen(getBadAnswer(item));

        }

        this.emit(":responseReady");
    },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AMAZON.PauseIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
});


const quizHandlers = Alexa.CreateStateHandler(states.QUIZ,{
    "Quiz": function() {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["quizscore"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function() {
        if (this.attributes["counter"] == 0)
        {
            this.attributes["response"] = START_QUIZ_MESSAGE + " ";
        }

        let random = getRandom(0, data.length-1);
        let item = data[random];

        let propertyArray = Object.getOwnPropertyNames(item);
        let property = propertyArray[getRandom(1, propertyArray.length-1)];

        this.attributes["quizitem"] = item;
        this.attributes["quizproperty"] = property;
        this.attributes["counter"]++;

        let question = getQuestion(this.attributes["counter"], property, item);
        let speech = this.attributes["response"] + question;

        this.emit(":ask", speech, question);
    },
    "AnswerIntent": function() {
        let response = "";
        let speechOutput = "";
        let item = this.attributes["quizitem"];
        let property = this.attributes["quizproperty"];

        let correct = compareSlots(this.event.request.intent.slots, item[property]);

        if (correct)
        {
            response = getSpeechCon(true);
            this.attributes["quizscore"]++;
        }
        else
        {
            response = getSpeechCon(false);
        }

        response += getAnswer(property, item);

        if (this.attributes["counter"] < 10)
        {
            response += getCurrentScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        }
        else
        {
            response += getFinalScore(this.attributes["quizscore"], this.attributes["counter"]);
            speechOutput = response + " " + EXIT_SKILL_MESSAGE;

            this.response.speak(speechOutput);
            this.emit(":responseReady");
        }
    },
    "AMAZON.RepeatIntent": function() {
        let question = getQuestion(this.attributes["counter"], this.attributes["quizproperty"], this.attributes["quizitem"]);
        this.response.speak(question).listen(question);
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.PauseIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("AnswerIntent");
    }
});

function compareSlots(slots, value)
{
    for (let slot in slots)
    {
        if (slots[slot].value != undefined)
        {
            if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

function getItem(slots)
{
    let propertyArray = Object.getOwnPropertyNames(data[0]);
    let value;

    for (let slot in slots)
    {
        if (slots[slot].value !== undefined)
        {
            value = slots[slot].value;
            for (let property in propertyArray)
            {
                let item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
                if (item.length > 0)
                {
                    return item[0];
                }
            }
        }
    }
    return value;
}

function getSpeechCon(type)
{

    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function formatCasing(key)
{
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, quizHandlers);
    alexa.execute();
};
