import { Role } from './role';

export class Login {
    public uuid: string;
    public userCompany: string;
    public name: string;
    public email: string;
    public roles: Array<Role>;
    public token: string;
    constructor() {
        this.uuid = '';
        this.userCompany = '';
        this.name = '';
        this.email = '';
        this.roles = [];
        this.token = '';
    }
}
