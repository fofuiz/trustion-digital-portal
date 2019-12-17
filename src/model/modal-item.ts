export class ModalItem {
    public type: string;
    public name: string;
    public origin: string;
    public title: string;
    public message: string;
    public body: any;
    public visible: boolean;
    public width: string;
    public height: string;
    constructor() {
        this.type = '';
        this.name = '';
        this.origin = '';
        this.title = '';
        this.message = '';
        this.body = {};
        this.visible = false;
        this.width = '';
        this.height = '';
    }
}
