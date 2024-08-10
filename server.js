const
    {
        AllDonationsModel,
        MonthlyDataModel,
        WhatsappTrackerModel,
        AnnouncementModel,
        CustomersInfoModel,
        ConfigurationModel,
        EmailTrackerModel,
        MeetingsModel,
        NotesModel,
        LogsModel,
        ContactsModel,
        AccountModel,
        MemberModel,
        UsersModel,
        FormModel,
        complaintModel,
    } = require("./Model");
// const { app } = require("./app.js");
const userControllers = require("./Controllers/UsersController.js")
const { Route } = require("./Controllers/CommonController.js")
const { NoAuthRoute } = require("./Controllers/CommonController.noAuth.js")
const { loginController } = require("./Controllers/LoginController.js");
const { sendMail } = require('./Features/SendMail');
const { Chat } = require("./Controllers/ChatsController");
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require("dotenv").config();
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }))
app.use(express.static("build"));
const cors = require("cors");
const { memberLoginController } = require("./Controllers/MemberController");
const { default: axios } = require("axios");
const port = 3003;
const { default: mongoose } = require("mongoose");

mongoose.connect(process.env.CONNECTION_STRING, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.get(`/`, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})
app.get(`/client/:route`, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})
app.get(`/client/:route/:r1`, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})
app.get(`/client/:route/:r1/:r2`, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})
app.get(`/client/:route/:r1/:r2/:r3`, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})
app.get(`/client/:route/:r1/:r2/:r3/:r4`, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})
app.get(`/client/:route/:r1/:r2/:r3/:r4/:r5`, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})

app.use(express.json({ limit: '50mb' }))
app.use(cors())
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    socket.on("sendMessage", (message) => {
        console.log(message)
        io.emit("recieveMessage", message)
    })
});

const Razorpay = require("razorpay");
const { authenticateToken } = require("./Authorization/AuthenticateToken");
const { sendWhatsapp } = require("./Features/sendWhatsapp.js");
const { sendBirthdays } = require("./Features/getBirthdays.js");
const { getTodaysBirthdayMembers, getTodaysBirthdayChildrens, getTodaysAnniversaryMembers, getTodaysBirthdayUsers } = require("./Features/birthdayFunctions.js");
// Payment Gateway Integration Starts Here

var instance = new Razorpay({
    key_id: 'rzp_test_nSahl5FThvw7uJ',
    key_secret: 'd4p6ON5LLXwJXM8gg9mB93qo'
})

app.post("/create/orderId", async (req, res) => {
    const data = req.body;

    const options = {
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: "rcp1"
    }
    instance.orders.create(options, (err, order) => {
        console.log(order);
        res.send({
            orderId: order.id
        })
    })
});





// Users EndPoint

app
    .get("/users", userControllers.getUsers)
    .get("/users/:id", userControllers.getUsersById)
    .post("/users", userControllers.addUsers)
    .post("/addEmployee", userControllers.addAnyEmployee)
    .patch("/users/:id", userControllers.updateUsersById)
    .patch("/users/email/:email", userControllers.updatePasswordByEmail)
    .delete("/users/:id", userControllers.deleteUsersById);

app.post("/users/getDataByCenters", async (req, res) => {
    let centers = req.body.centers;
    if (!centers || centers.length === 0) return res.json([])
    let userID = req.body.userID;
    let data = await UsersModel.find({});
    let temp = [];
    console.log(centers)
    for (let item of data) {
        if (item.isAdmin) continue
        for (let cen of centers) {
            if (item.centers.includes(cen)) {
                temp.push(item);
                break;
            }
        }
    }
    temp = temp.filter(i => {
        if (userID == i.userID) return false;
        return true
    })
    console.log(temp)
    res.json(temp)
})





// Meeetings EndPoint
Route(app, "meetings", MeetingsModel)

// Notes EndPoint
Route(app, "notes", NotesModel)

// Contacts EndPoint
Route(app, "contacts", ContactsModel)

// Accounts EndPoint
Route(app, "accounts", AccountModel)

// Member EndPoint
NoAuthRoute(app, "member", MemberModel);
// form EndPoint
NoAuthRoute(app, "form", FormModel)

// Member EndPoint
Route(app, "logs", LogsModel)

app.post("/log", async (req, res) => {
    const data = req.body;
    try {
        const member = new LogsModel(data);
        await member.save();
        res.send(data);
    } catch (err) {
        // console.log(err)
        res.send(err);
    }
})


//announcement endpoint
Route(app, "announcement", AnnouncementModel)

//all donations endpoint
Route(app, "allDonations", AllDonationsModel)

//montly Data of donations endpoint
Route(app, "monthlyData", MonthlyDataModel)

//complaint endpoint
Route(app, "complaint", complaintModel)

app.post('/complaint/:id/chats', async (req, res) => {
    const { id } = req.params;
    const { to, from, body, date, time, read } = req.body;

    try {
        // Find the complaint by id
        const complaint = await complaintModel.findById(id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Add new chat message to the chats array
        const newChat = { to, from, body, date, time, read };
        complaint.chats.push(newChat);

        // Save the updated complaint document
        await complaint.save();

        res.status(200).json(complaint);
    } catch (error) {
        console.error('Error adding chat message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post("/member/getDataByCenters", async (req, res) => {
    let centers = req.body.centers;
    console.log(centers)
    if (!centers || centers.length === 0) return res.json([])
    // let userID = req.body.userID;
    let temp = [];
    for (let i of centers) {
        temp.push({
            center: i
        })
    }
    if (req.query.donorType) {
        let data = await MemberModel.find({
            $or: temp,
            "details.donorType": req.query.donorType
        });
        return res.json(data)
    }
    let data = await MemberModel.find({
        $or: temp,
    });
    res.json(data)
})

app.get("/userDataByToken", authenticateToken, async (req, res) => {
    res.send(req.user)
})

// emailTracker EndPoint
Route(app, "emailTracker", EmailTrackerModel)


// whatsappTracker EndPoint
Route(app, "whatsappTracker", WhatsappTrackerModel);

app.post("/whatsappTracker/getDataByCenters", async (req, res) => {
    let centers = req.body.centers || [];

    if (!centers || centers.length === 0) return res.json([])
    let data = await WhatsappTrackerModel.find({});
    let temp = [];

    for (let item of data) {
        for (let cen of centers) {
            if ((item.center).includes(cen)) {
                temp.push(item);
                break;
            }
        }
    }

    console.log(temp)
    res.json(temp)
})
app.post("/emailTracker/getDataByCenters", async (req, res) => {
    let centers = req.body.centers || [];

    if (!centers || centers.length === 0) return res.json([])
    let data = await EmailTrackerModel.find({});
    let temp = [];

    for (let item of data) {
        for (let cen of centers) {
            if ((item.center).includes(cen)) {
                temp.push(item);
                break;
            }
        }
    }

    console.log(temp)
    res.json(temp)
})

// customersInfo EndPoint
Route(app, "customersInfo", CustomersInfoModel)

// Configuration EndPoint
Route(app, "configuration", ConfigurationModel)

// Send Mail

sendMail(app)
sendWhatsapp(app)
sendBirthdays(app)
// Send Mail

Chat(app, io)

// login

app.post('/signin', loginController);

// Member login

app.post('/memberLogin', memberLoginController);

function formatDateToYYYYMMDD() {
    let date = new Date()
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}




//Birthday mail Sender
cron.schedule("0 0 * * *", async () => {
    console.log("Ran");
    // cron.schedule('0 0 * * *', async () => {
    try {
        const birthdayMembers = await getTodaysBirthdayMembers();
        const birthdayChildrens = await getTodaysBirthdayChildrens();
        const anniversaryMembers = await getTodaysAnniversaryMembers();
        const birthdayUsers = await getTodaysBirthdayUsers()
        // const birthdayMembers = await MemberModel.find({
        //     dob: today,
        // });
        // const birthdayChildrens = await getTodaysBirthdayChildrens();
        // const aniversaryMembers = await getTodaysAniversaryMembers();

        // Send birthday emails
        birthdayUsers.forEach(async (user) => {
            const mailOptions = {
                from: 'softwarewizard@icfdr.org',
                to: user.email,
                subject: 'Happy Birthday!',
                text: `Happy Birthday ${user.name}
            May your day be filled with laughter, love, and all your heart desires. Thanks for being a part of our family. Here's to another amazing year ahead.
            From iCFDR.`,
            };
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'softwarewizard@icfdr.org',
                    pass: 'sxjo suxt omjl nngi'
                    // user: 'icfdrtesting1011@gmail.com',
                    // pass: 'owaqjzqszbsinbms'
                }
            });
            axios.post(`http://voice.roundsms.co/api/sendmsg.php?user=ICDR&pass=123456&sender=ICFDRV&phone=${user.phone}&text=Happy Birthday May your day be filled with laughter, love, and all your heart desires. Thanks for being a part of our family. Here's to another amazing year ahead.
        From_ iCFDR, Family.&priority=ndnd&stype=normal`).then(res => console.log(res)).catch(err => console.log(err))
            axios.post(`https://voice.roundsms.co/api/sendmsg.php?user=ICFDRWA&pass=123456&sender=BUZWAP&phone=${user.phone}&text=birthday_year&priority=wa&stype=normal&Params=${user.name},${user.name},From%20ICFDR%20Family`).then(res => console.log(res)).catch(err => console.log(err))

            await transporter.sendMail(mailOptions);
            console.log(`Birthday email sent to ${member.name}`);
        });
        birthdayMembers.forEach(async (member) => {
            const mailOptions = {
                from: 'softwarewizard@icfdr.org',
                to: member.email,
                subject: 'Happy Birthday!',
                text: `Happy Birthday ${member.name}
              May your day be filled with laughter, love, and all your heart desires. Thanks for being a part of our family. Here's to another amazing year ahead.
              From iCFDR.`,
            };
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'softwarewizard@icfdr.org',
                    pass: 'sxjo suxt omjl nngi'
                    // user: 'icfdrtesting1011@gmail.com',
                    // pass: 'owaqjzqszbsinbms'
                }
            });
            axios.post(`http://voice.roundsms.co/api/sendmsg.php?user=ICDR&pass=123456&sender=ICFDRV&phone=${member.phone}&text=Happy Birthday May your day be filled with laughter, love, and all your heart desires. Thanks for being a part of our family. Here's to another amazing year ahead.
          From_ iCFDR, Family.&priority=ndnd&stype=normal`).then(res => console.log(res)).catch(err => console.log(err))
            axios.post(`https://voice.roundsms.co/api/sendmsg.php?user=ICFDRWA&pass=123456&sender=BUZWAP&phone=${member.phone}&text=birthday_year&priority=wa&stype=normal&Params=${member.name},${member.name},From%20ICFDR%20Family`).then(res => console.log(res)).catch(err => console.log(err))

            await transporter.sendMail(mailOptions);
            console.log(`Birthday email sent to ${member.name}`);
        });
        birthdayChildrens.forEach(async (children) => {
            const mailOptions = {
                from: 'softwarewizard@icfdr.org',
                to: children.email,
                subject: 'Happy Birthday!',
                text: `Dear ${children.memberName},\n\nHappy birthday to your son ${children.name}! 🎉🎂`,
            };
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'softwarewizard@icfdr.org',
                    pass: 'sxjo suxt omjl nngi'
                    // user: 'icfdrtesting1011@gmail.com',
                    // pass: 'owaqjzqszbsinbms'
                }
            });
            await transporter.sendMail(mailOptions);
            axios.post(`http://voice.roundsms.co/api/sendmsg.php?user=ICDR&pass=123456&sender=ICFDRV&phone=${children.phone}&text=Happy Birthday May your day be filled with laughter, love, and all your heart desires. Thanks for being a part of our family. Here's to another amazing year ahead.
          From_ iCFDR, Family.&priority=ndnd&stype=normal`).then(res => console.log(res)).catch(err => console.log(err))
            console.log(`Birthday email sent to ${children.name}`);
            axios.post(`https://voice.roundsms.co/api/sendmsg.php?user=ICFDRWA&pass=123456&sender=BUZWAP&phone=${children.phone}&text=birthday_year&priority=wa&stype=normal&Params=${children.name},${children.name},From%20ICFDR%20Family`).then(res => console.log(res)).catch(err => console.log(err))
        });
        anniversaryMembers.forEach(async (member) => {
            const mailOptions = {
                from: 'softwarewizard@icfdr.org',
                to: member.email,
                subject: 'Happy Anniversary!',
                text: `Dear ${member.memberName},\n\nHappy Marraige Anniversary both you & ${member.spouseName}! Regards, ICFDR 🎉🎂`,
            };
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'softwarewizard@icfdr.org',
                    pass: 'sxjo suxt omjl nngi'
                    // user: 'icfdrtesting1011@gmail.com',
                    // pass: 'owaqjzqszbsinbms'
                }
            });
            await transporter.sendMail(mailOptions);
            axios.post(
                `https://voice.roundsms.co/api/sendmsg.php?user=ICDR&pass=123456&sender=ICFDRV&phone=${member.phone}&text=Happy Anniversary Wishing you endless love, joy, and togetherness on this special day. May your journey be as beautiful as the love you share. From iCFDR, {#var#}.&priority=ndnd&stype=normal`
            )
        });
    } catch (error) {
        console.error("Error:", error);
    }
});


cron.schedule('0 0 * * *', async () => {
    console.log("Ran")
    try {
        let today = formatDateToYYYYMMDD()
        const BASE_CALENDAR_URL =
            "https://www.googleapis.com/calendar/v3/calendars";
        const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY =
            "holiday@group.v.calendar.google.com"; // Calendar Id. This is public but apparently not documented anywhere officialy.
        const API_KEY = process.env.API_KEY;
        const CALENDAR_REGION = "en.indian";

        const url2 = `${BASE_CALENDAR_URL}/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${API_KEY}`;

        const Members = await MemberModel.find();

        let holidays = await axios.get(url2)
        holidays = holidays.data.items
        holidays = holidays.filter((el, i) => { return el.start.date == today })
        // Send birthday emails
        Members.forEach(async (member) => {
            for (let i = 0; i < holidays.length; i++) {
                const mailOptions = {
                    from: 'softwarewizard@icfdr.org',
                    to: member.email,
                    subject: holidays[i].summary,
                    text: `Dear ${member.details.name},\n\nWishing you a very happy ${holidays[i].summary} 🎉🎂, Regards, iCFDR Family.`,
                };
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'softwarewizard@icfdr.org',
                        pass: 'sxjo suxt omjl nngi'
                        // user: 'icfdrtesting1011@gmail.com',
                        // pass: 'owaqjzqszbsinbms'
                    }
                });

                await transporter.sendMail(mailOptions);
                axios.post(`https://voice.roundsms.co/api/sendmsg.php?user=ICFDRWA&pass=123456&sender=BUZWAP&phone=${member.phone}&text=jayous&priority=wa&stype=normal&Params=${member.details.name},${holidays[i]},ICFDR,Lord Krishna,${holidays[i]},${holidays[i]},ICFDR Family`).then(res => console.log(res)).catch(err => console.log(err))

            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
});


process.on('SIGINT', () => {
    db.close();
    console.log('MongoDB connection disconnected through app termination');
    process.exit(0);
});

// Start the Express server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
