const { UsersModel, MemberModel } = require("../Model");

async function getWeeklyBirthdayUsers() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  // startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  let lastDay = currentDate.getDate() + 7;
  const users = await UsersModel.find();
  let arr = [];
  for (let user of users) {
    if(!user?.details?.dob){
      continue
    }else{
      const userDob = user?.details?.dob?.split("-");
    console.log(userDob)
    const userBirthMonth = parseInt(userDob[1], 10);
    const userBirthDay = parseInt(userDob[2], 10);

    // Check if the birthday is within the next seven days
    if (
      (userBirthMonth === currentMonth && userBirthDay >= currentDay && userBirthDay <= lastDay) ||
      (userBirthMonth === currentMonth % 12 + 1 && userBirthDay <= lastDay - 31 + currentDay)
    ) {
          arr.push({
        _id: user._id,
        email: user.email,
        name: user.name,
        dob: user.details.dob,
        phone: user.phone || user.whatsApp,
      });
    }
    }
  }
  return arr;
}


async function getWeeklyBirthdayMembers() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const lastDay = currentDay + 7;
  const members = await MemberModel.find();
  let arr = [];

  for (let member of members) {
    const memberDob = member.dob.split("-");
    const memberBirthMonth = parseInt(memberDob[1], 10);
    const memberBirthDay = parseInt(memberDob[2], 10);

    // Check if the birthday is within the next seven days
    if (
      (memberBirthMonth === currentMonth && memberBirthDay >= currentDay && memberBirthDay <= lastDay) ||
      (memberBirthMonth === currentMonth % 12 + 1 && memberBirthDay <= lastDay - 31 + currentDay)
    ) {
      arr.push({
        _id: member._id,
        email: member.email,
        name: member.details.name,
        dob: member.dob,
        phone: member.details.whatsappNumber,
      });
    }
  }

  return arr;
}

async function getWeeklyBirthdayChildrens() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  // startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  let lastDay = currentDate.getDate() + 7;
  const members = await MemberModel.find();
  let arr = [];


  for (let member of members) {
    for (let children of member.details.children) {
    const childrenDob = children.dob.split("-");
    const childrenBirthMonth = parseInt(childrenDob[1], 10);
    const childrenBirthDay = parseInt(childrenDob[2], 10);

    // Check if the birthday is within the next seven days
    if (
      (childrenBirthMonth === currentMonth && childrenBirthDay >= currentDay && childrenBirthDay <= lastDay) ||
      (childrenBirthMonth === currentMonth % 12 + 1 && childrenBirthDay <= lastDay - 31 + currentDay)
    ) {
            arr.push({
          ...children,
          _id: member._id,
          email: member.email,
          memberName: member.details.name,
          phone: member.details.whatsappNumber,
        });
    }
  }
  }

  return arr;
}

async function getWeeklyAnniversaryMembers() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  // startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  let lastDay = currentDate.getDate() + 7;
  const members = await MemberModel.find();
  const arr = [];

  for (let member of members) {
    const anniversaryDate = member.details.dateOfMarriage.split("-");
    const anniversaryMonth = parseInt(anniversaryDate[1], 10);
    const anniversaryDay = parseInt(anniversaryDate[2], 10);

    // Check if the birthday is within the next seven days
    if (
      (anniversaryMonth === currentMonth && anniversaryDay >= currentDay && anniversaryDay <= lastDay) ||
      (anniversaryMonth === currentMonth % 12 + 1 && anniversaryDay <= lastDay - 31 + currentDay)
    ) {
          arr.push({
        _id: member._id,
        email: member?.email,
        memberName: member?.details?.name,
        spouseName: member?.details?.spouseName,
        phone: member?.details?.whatsappNumber,
        date:member.details.dateOfMarriage
      });
    }
  }

  return arr;
}

async function getTodaysBirthdayUsers() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const users = await UsersModel.find();
  let arr = [];
  for (let user of users) {
    if (!user.details || !user.details.dob) return arr;
    const userDob = user?.details?.dob?.split("-");
    if (userDob[1] == currentMonth && userDob[2] == currentDay) {
      arr.push({
        _id: user._id,
        email: user.email,
        name: user.name,
        dob: user.details.dob,
        phone: user.phone || user.whatsApp,
      });
    }
  }
  return arr;
}

async function getTodaysBirthdayMembers() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const members = await MemberModel.find();
  let arr = [];

  for (let member of members) {
    const memberDob = member.dob.split("-");
    if (memberDob[1] == currentMonth && memberDob[2] == currentDay) {
      arr.push({
        _id: member._id,
        email: member.email,
        name: member.details.name,
        dob: member.dob,
        phone: member.details.whatsappNumber,
      });
    }
  }

  return arr;
}

async function getTodaysBirthdayChildrens() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const members = await MemberModel.find();
  let arr = [];

  for (let member of members) {
    for (let children of member.details.children) {
      const childrenDob = children.dob.split("-");
      if (childrenDob[1] == currentMonth && childrenDob[2] == currentDay) {
        arr.push({
          ...children,
          _id: member._id,
          email: member.email,
          memberName: member.details.name,
          phone: member.details.whatsappNumber,
        });
      }
    }
  }

  return arr;
}

async function getTodaysAnniversaryMembers() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const members = await MemberModel.find();
  const arr = [];

  for (let member of members) {
    const anniversaryDate = member.details.dateOfMarriage.split("-");
    if (
      anniversaryDate[1] == currentMonth &&
      anniversaryDate[2] == currentDay
    ) {
      arr.push({
        _id: member._id,
        email: member?.email,
        memberName: member?.details?.name,
        spouseName: member?.details?.spouseName,
        phone: member?.details?.whatsappNumber,
        date:member.details.dateOfMarriage
      });
    }
  }

  return arr;
}
module.exports = {
  getWeeklyAnniversaryMembers,
  getWeeklyBirthdayChildrens,
  getWeeklyBirthdayMembers,
  getWeeklyBirthdayUsers,
  getTodaysBirthdayUsers,
  getTodaysBirthdayMembers,
  getTodaysBirthdayChildrens,
  getTodaysAnniversaryMembers,
};
