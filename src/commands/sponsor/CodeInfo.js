const patron = require('patron.js');
const db = require('../../database');
const Constants = require('../../utility/Constants.js');

class CodeInfo extends patron.Command {
  constructor() {
    super({
      names: ['codeinfo', 'codeinformation', 'referralcodeinfo', 'referinfo', 'refercodeinfo'],
      groupName: 'sponsor',
      description: 'View the information of any referral code.',
      args: [
        new patron.Argument({
          name: 'code',
          key: 'code',
          type: 'string',
          example: 'KEEM',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const codeRegex = new RegExp('^' + args.code.replace(Constants.data.regexes.escape, '\\$&') + '$', 'i');

    const codeOwner = await db.userRepo.findOne({ guildId: msg.guild.id, referralCode: { $regex: codeRegex } });

    if (codeOwner === null) {
      return msg.createErrorReply('This referral code does not exist.');
    }

    const user = msg.client.users.get(codeOwner.userId);
    const uses = await db.userRepo.count({ guildId: msg.guild.id, referredBy: codeOwner.userId });

    return msg.channel.createMessage('**Uses:** ' + uses + '\n**Owner:** ' + (user !== undefined ? user.tag : 'Unknown'), { title: 'Code Information: ' + codeOwner.referralCode });
  }
}

module.exports = new CodeInfo();
