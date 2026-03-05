export interface IUser {
    id: string;
    email : string;
    name: string;
    password ? : string;
    profile_pic? : string;
    created_at : Date;
    updated_at? : Date;
}