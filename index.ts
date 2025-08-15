import express,{Express} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import * as database from "./config/database"

import mainV1Routers from "./api/v1/routes/index.route";

dotenv.config();
database.connect()


const app:Express = express()
const port:Number|String = process.env.PORT || 3000

const corsOptions={

}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mainV1Routers(app)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})