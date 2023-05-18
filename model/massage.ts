import mongoose, { Document, Schema, Types } from 'mongoose';

const AutoIncrement = require('mongoose-sequence')(mongoose);
import mongooseLeanDefaults from 'mongoose-lean-defaults';


export interface IMassage  {
    body: string,
    to:Types.ObjectId,
    favorite:boolean  
    reply:String 
    _id:mongoose.Schema.Types.ObjectId
    display:boolean,
    save(): unknown;


}

const massageSchema  = new Schema<IMassage>({
        to: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        body:{
            type:String,
            required: true
        },
        favorite:{
            type:Boolean,
            default:false
        },
        reply:{
            type:String,
        },
        display:{
            type:Boolean,
            default:false
        }

    },
    {
        timestamps: true
    }
);

massageSchema.plugin(AutoIncrement, {
    inc_field: 'id',
    id: 'MassageNums',
    start_seq: 1500
})

massageSchema.plugin(mongooseLeanDefaults)

export default mongoose.model('Massage', massageSchema);


