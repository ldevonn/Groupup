const { GroupImage, EventImage, Member, Group } = require("../db/models");

//image handler
async function noImage(type, imageId) {
  let image;
  if (type === "group") {
    image = await GroupImage.findByPk(imageId);
  }
  if (type === "event") {
    image = await EventImage.findByPk(imageId);
  }
  if (image) {
    return image;
  } else {
    return true;
  }
}

//user handler
async function userValidate(reqId, groupId) {
  const group = await Group.findByPk(groupId);
  const member = await Member.findOne({
    where: { userId: reqId },
  });

  if (group.organizerId === reqId) {
    return true;
  }
  if (member) {
    if (member.status == "co-host") {
      return true;
    }
  } else {
    return false;
  }
}

module.exports = { noImage, userValidate };
