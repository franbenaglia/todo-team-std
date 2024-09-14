export class Token {
    constructor(public token: string, public refresh_token: string, public expires: number) { }
}