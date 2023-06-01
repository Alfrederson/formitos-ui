import { user, doLogin, checkIfLogged } from "./user"

type LoginData = {
    email : string,
    password: string
}

type UserClaims = {
    id : number,
    name: string,
    email: string,
    iat: number
}

type UserStore = {
    logged: boolean,
    tryingToLogIn: boolean,
    tryingToRefresh: boolean,
    claims: UserClaims,
}

export { user, doLogin, checkIfLogged, LoginData, UserStore, UserClaims }