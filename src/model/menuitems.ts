export interface MenuNode {
    id: number;
    parentId?: number;
    hasChildren?: boolean;
    name: string;
    isSelected: boolean;
    hasPermission: boolean;
    link: string;
    tooltip?: string;
    style?: string;
    fontSet?: string;
    fontIcon?: string;
    children?: MenuNode[];
}