const express = require("express");
const app = express();
const Botly = require("botly");
const https = require("https");
const axios = require('axios');
const qs = require('qs');
const { HfInference } = require("@huggingface/inference");
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SB_URL, process.env.SB_KEY, { auth: { persistSession: false } });
// /** db **/

const inference = new HfInference(process.env.key);

async function createUser(user) {
    const { data, error } = await supabase
        .from('fbChat')
        .insert([user]);

    if (error) {
        throw new Error('Error creating user : ', error);
    } else {
        return data
    }
};

async function updateUser(id, update) {
    const { data, error } = await supabase
        .from('fbChat')
        .update(update)
        .eq('id', id);

    if (error) {
        throw new Error('Error updating user : ', error);
    } else {
        return data
    }
};
async function userDb(userId) {
    const { data, error } = await supabase
        .from('fbChat')
        .select('*')
        .eq('id', userId);

    if (error) {
        console.error('Error checking user:', error);
    } else {
        return data
    }
};
const botly = new Botly({
    accessToken: process.env.token,
    verifyToken: process.env.v,
    notificationType: Botly.CONST.REGULAR,
    FB_URL: "https://graph.facebook.com/v2.6/",
});

app.get("/", function (_req, res) {
    res.sendStatus(200);
});
msgDev = "يمكنك الان ان تسمع الكلمات بصوت وضح \n وجميل ويمكنك اختيار العديد\n من الاصوات رجال ونساء \n اختر اي شخصية لتسمع كماتك بصوتها \n الحد الاقصى 1000 حرف \n قم بمتابعة المطور 👇\n https://www.facebook.com/salah.louktaila"
async function ChatLama(msg) {
    try {
        let out = '';
        for await (const chunk of inference.chatCompletionStream({
            model: 'meta-llama/Llama-3.2-3B-Instruct',
            messages: [{ role: "user", content: msg }],
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 0.7
        })) {
            if (chunk.choices && chunk.choices.length > 0) {
                const newContent = chunk.choices[0].delta.content;
                out += newContent;
            }
        }

        // Send the response back to the client
        return out
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }

}
app.use(express.json({ verify: botly.getVerifySignature() }));
app.use(express.urlencoded({ extended: false }));

app.use("/webhook", botly.router());
//msgDev = '\n  مرحبا بكم في بوت VoiceMe الان  يمكنك كتابة اي نص والبوت يقوم بتحويله الى مقطع صوتي بذكاء الاصطناعي ولديك خيارات من اصوات رجال ونساء مسموح ب 1000حرف استمتع بالبوت \n قم بمتابعة المطور 👇\n https://www.facebook.com/salah.louktaila\n ';// `مرحبا بك في بوت LktText \n الذي يقوم بتحويل  المقطع الصوتي الى نص\n قم باعادة توجيه صوت من اي محادثة الى البوت وسيتم تحويل \n اذا واجهت اي مشكلة اتصل بالمطور \n حساب المطور 👇\n https://www.facebook.com/salah.louktaila`
msgDev = 'أنا بوت دردشة هنا لمساعدتك والإجابة على أسئلتك، وتقديم المعلومات التي تحتاجها بطريقة سهلة وسريعة.\n سواء كنت تبحث عن نصائح، أو تحتاج لمعلومات معينة، أو حتى ترغب في بعض الترفيه، أنا هنا لأقدم لك الدعم.\nلا تتردد في طرح أي سؤال يخطر ببالك، وسأبذل جهدي لأوفر لك أفضل إجابة ممكنة. 😊 \nاذا واجهت اي مشكلة اتصل بالمطور \n حساب المطور 👇\n https://www.facebook.com/salah.louktaila'
botly.on("message", async (senderId, message) => {




    if (message.message.text) {
        const user = await userDb(senderId);
        if (user[0]) { // kayen     
            const messagesReplay = ChatLama(message.message.text)
            botly.sendText({ id: senderId, text: messagesReplay });

        }
        else {
            //MessageVoice(message.message.text, senderId)
            await createUser({ id: senderId, vip: false })
                .then(async (data, error) => {
                    botly.sendText({ id: senderId, text: msgDev });
                });


        }
    } else if (message.message.attachments[0].payload.sticker_id) {
        botly.sendText({ id: senderId, text: "جام" });
    } else if (message.message.attachments[0].type == "image") {
        botly.sendText({ id: senderId, text: "image" });

    } else if (message.message.attachments[0].type == "audio") {
        botly.sendText({ id: senderId, text: "audio" });



    } else if (message.message.attachments[0].type == "video") {
        console.log(message.message.attachments[0])
        botly.sendText({ id: senderId, text: "فيديو" });
    }
});
console.log(`text :${msgVoice}`)
botly.on("postback", async (senderId, message, postback) => {
    if (message.postback) {
        if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (message.postback.title == "") {
            //
        } else if (message.postback.title == "") {
            //
        } else if (message.postback.title == "") {
            //
        } else if (message.postback.title == "") {
            //
        }
    } else {

    }
});
/* ---- PING ---- */




function keepAppRunning() {
    setInterval(() => {
        https.get(`'${process.env.RENDER_EXTERNAL_URL}'/ping`, (resp) => {
            if (resp.statusCode === 200) {
                console.log('Ping successful');
            } else {
                console.error('Ping failed');
            }
        });
    }, 5 * 60 * 1000);
}

app.get('/ping', (req, res) => { res.status(200).json({ message: 'Ping successful' }); });

/* ---- PING ---- */

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
    //  keepAppRunning();
});