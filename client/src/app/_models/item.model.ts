import {User} from './user.model'
export interface Item {
    _id:string;
    item_name?:string;
    item_number?:string;
    item_date?:string;
    item_Location?: string;
    item_description?:string;
    item_image?:File;
    item_cost?:string;
    isItem_Approved?:boolean;
    isItem_Available?:boolean;
}


export interface ItemDetails {
    _id:string;
    item_name?:string;
    item_number?:string;
    item_date?:string;
    item_Location?: string;
    item_description?:string;
    item_image?:File;
    item_cost?:string;
    isItem_Approved?:boolean;
    isItem_Available?:boolean;
    userId: User
}