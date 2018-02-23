/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

'use strict';

module.exports = Object.freeze({
    // App-ID
    APP_ID : 'amzn1.ask.skill.b128a952-0622-4b06-b8a8-487a0f1e2fa9',

    // Custom Skill Settings
    DYNAMO_SESSION_TABLE : 'user_quiz_tracker',
    TOTAL_QUESTIONS : 2,

    // For code debugging
    DEBUG : false,

    // States for state handlers
    STATES : {
        START : '',
        HELP : '_HELP_MODE',
        CODE : '_WAITING_FOR_CODE_MODE', // User needs to provide a voice code
        CHANGE_CODE : '_CHANGE_CODE', // User wants to change their voice code, confirming current code
        NEW_CODE : '_NEW_CODE', // User wants to set their new voice code
        SECURE : '_SECURE' // voice code validated
    }
});
