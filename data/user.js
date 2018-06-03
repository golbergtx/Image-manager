class User {
    constructor(userID, login, firstName, lastName, age, priority, avatarFileName = null) {
        this.userID = userID;
        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.priority = priority;
        this.avatarFileName = avatarFileName;
    }

    updateData(login, firstName, lastName, age) {
        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`
    }
}

module.exports = User;