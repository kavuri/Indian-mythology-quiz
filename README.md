# Indian-mythology-quiz
Indian mythology quiz for Alexa
This is a quiz on Indian mythology for Alexa. It currently covers Ramayana and Mahabharata.

Implementation stack
 - AWS Lambda
 - AWS Dynamo DB
 - NodeJS 8
 
Setup
 - Run tables.js to create tables in AWS DynamodDB
   - This file also creates the quiz questions to the database
 - Upload the lambda project to AWS (aws deploy)
 - Enable the skill from your Alexa account
