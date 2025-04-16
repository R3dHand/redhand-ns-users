export class UserPreferences {
    userId;
    theme;

    constructor(userId, body) {
        this.userId = userId;
        this.theme = body.theme;
    }
}