import mongoose, { Document, Schema } from 'mongoose';

export type Privacy={

    accept_msg:boolean,
    accept_photo:boolean,
    accept_bad:boolean,
    show_visit:boolean,
    show_seen:boolean,
    accept_search:boolean,


}

export interface IUser {
    _doc: any;
    lean(): unknown;
    save(): unknown;
    _id: any;
    username: string,
    email: string,
    roles: string[],
    password: string,
    forgetPasswordToken: string,
    img:string,
    privacy:Privacy,
    brief:string
    visits:number,
    id:number,
    isOnline:boolean,
    lastSeen:Date,
    



}

const userSchema  = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    roles: {
        type: [String],
        default: ["Employee"]

    },

    password: {
        type: String,
        required: true
    },

    forgetPasswordToken:{
        type:String,
    },
    img: {
        type:String,
    },
    privacy:{
        accept_msg:{
            type:Boolean,
            default: true
        },
        accept_photo:{
            type:Boolean,
            default: false
        },
        accept_bad:{
            type:Boolean,
            default: true

        },
        show_visit:{
            type:Boolean,
            default: false
        },
        show_seen:{
            type:Boolean,
            default: true
        },
        accept_search:{
            type:Boolean,
            default: true
        },
    
    },

    brief:{ 
        type:String,
        default: ""
    },

    visits:{
        type:Number,
        default: 0
    },

    isOnline:{
        type:Boolean,
        default:false
    },
    lastSeen:{
        
        type:Date,

    }
    

    
});




export default mongoose.model('User', userSchema);


