const express = require("express")
const cron = require("node-cron");
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

let mainApi = "https://work-tracer.vercel.app/api"
let chatIDs = {
    cyril: '5605980394',
    aman: '5448323108'
}


const addToday = async () => {
    try {
        await axios.post(mainApi + "/cron_jobs/add_today")
    } catch (error) {
    }
}

const getIndiaTime = () => {
    let timeDate = new Date();
    let timeZone = "Asia/Calcutta";
    let time = timeDate.toLocaleString("en-US", { timeZone: timeZone });
    let newTime = "";


    let hasCommaPassed = false;
    for (let char of time) {
        if (char === ",") {
            hasCommaPassed = true;
            continue
        }

        if (hasCommaPassed && char !== " ") {
            newTime += char
        }

    }

    return newTime;
}


async function SendTGMessage(chat_id, message) {
    // Aman Chat Id : 5448323108
    const token = "6925336596:AAGENTYw7MN57wWy2IsW_Pi5otpzkmWLnSM";
    let bot = new TelegramBot(token);
    // bot.on('message', msg => {
    //     console.log(msg);
    // })

    await bot.sendMessage(chat_id, message)

}


SendTGMessage(chatIDs.aman, `Hey Aman, Cron is deployed successfully, and the current time in india is ${getIndiaTime()}, is it?\nWork Tracer.`);
// SendTGMessage(chatIDs.cyril, `Hey Cyril, this work tracer, `)


cron.schedule('* * * * * *', () => {

    let time = getIndiaTime();

    if (time === "11:55:00PM") {
        let message = `Hey Aman! This Work Tracer, I want you to inform that it's been 11:55PM, which means you have to start working in 5 minutes... All the best.\nThanks you...`
        SendTGMessage(chatIDs.aman, message)

        message = `Hey Cyril! This Work Tracer, I want you to inform that it's been 11:55PM in India, which means Aman will start working after 5 minutes... I've informed Aman too.\nThank You...`
        SendTGMessage(chatIDs.cyril, message)

    }

    if (time.startsWith("12:00") && time.endsWith("AM")) {
        addToday();
    }

});




const app = express();

app.get("/", (req, res) => {
    res.end("Internal Server Error.");
});

app.listen(process.env.PORT || 3001, () => {
    console.log("Listening...");
});


const token = "6925336596:AAGENTYw7MN57wWy2IsW_Pi5otpzkmWLnSM";
let bot = new TelegramBot(token, {polling: true});
bot.on('message', msg => {
    bot.sendMessage(chatIDs.aman, "I'm Up!!!")
})

