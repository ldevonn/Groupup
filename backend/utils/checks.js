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
async function userValidate(reqId) {
  const user = await Member.findOne({
    where: { userId: reqId },
  });

  const groupId = user.groupId;
  const group = await Group.findByPk(groupId);

  return user.status == "co-host" || group.organizerId === reqId;
}

module.exports = { noImage, userValidate };
