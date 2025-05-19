import mongoose, {Types} from "mongoose";

const MessageSchema = new mongoose.Schema({
    user: {
        required: true,
        type: Types.ObjectId,
    },
    text: {
        required: true,
        type: String,
    },
    datetime: {
        required: true,
        type: Date,
    }
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;