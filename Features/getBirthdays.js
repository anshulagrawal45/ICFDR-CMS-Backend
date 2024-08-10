const { getWeeklyBirthdayMembers, getWeeklyBirthdayChildrens, getWeeklyAnniversaryMembers, getWeeklyBirthdayUsers } = require("./birthdayFunctions");

exports.sendBirthdays = (app) => {
  app.get("/getBirthdays", async (req, res) => {
    try {

      // Filter members with upcoming birthdays
      const filteredBirthdayMembers = await getWeeklyBirthdayMembers()

      const childrensBirthday = await getWeeklyBirthdayChildrens()

      const anniversaries = await getWeeklyAnniversaryMembers()
      const filteredUsersWithUpcomingWeekBirthday =await getWeeklyBirthdayUsers()

      res.send({
        users: filteredUsersWithUpcomingWeekBirthday,
        members: filteredBirthdayMembers,
        childrens:childrensBirthday,
        anniversaries
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
};
