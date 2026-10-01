import multer from "multer";
import { randomUUID } from "crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, `${randomUUID()}-${file.originalname}`)
    }
  })
  
export const upload = multer({ 
    storage, 
})