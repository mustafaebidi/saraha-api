"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const dbCon_1 = __importDefault(require("./config/dbCon"));
const massage_1 = __importDefault(require("./routes/massage"));
var cors = require('cors');
const app = (0, express_1.default)();
const port = 3850;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const allowedOrigins = ["https://saraha-4070.onrender.com"];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
(0, dbCon_1.default)();
app.use(cors(corsOptions));
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', require('./routes/root'));
app.use('/auth', auth_1.default);
app.use('/massage', massage_1.default);
app.use(express_1.default.static('public'));
app.listen(port, () => {
    console.log(`Timezones by location application is  on port ${port}.`);
});
