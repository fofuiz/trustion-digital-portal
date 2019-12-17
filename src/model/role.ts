import { Permission } from './permission';

export class Role {
    public name: string;
    public permissions: Array<Permission>;
    constructor() {
        this.name = '';
        this.permissions = [];
    }
}
