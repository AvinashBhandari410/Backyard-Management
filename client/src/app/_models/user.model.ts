export interface User {
    _id:string;
    full_name:string;
    email_address:string;
    password:string;
    phone_number:string;
    user_type:string;
    is_useractive:boolean;
    created_date?:string;
}
