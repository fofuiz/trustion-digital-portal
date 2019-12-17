export class ModalDialog {
    public title: string;
    public message: string;
    public body: any;
    public width?: string;
    public height?: string;
    constructor() {
        this.title = '';
        this.message = '';
        this.body = {};
    }
}
