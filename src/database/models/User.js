class User {
  constructor(userId, guildId) {
    this.userId = userId;
    this.guildId = guildId;
    this.cash = 0;
    this.reputation = 0;
  }
}

module.exports = User;
