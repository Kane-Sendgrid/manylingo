export class API {
    static authQuery() {
        return "token=" + localStorage.getItem("token");
    }

    static removeAuth() {
        localStorage.removeItem("token")
    }

    static isAuthenticated() {
        return localStorage.getItem("token") != null;
    }
}