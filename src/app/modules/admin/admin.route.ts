import  express  from "express"
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { updateAdminValidationSchema } from "./admin.validation";


const router = express.Router();

router.get('/',AdminController.getAllAdmins);
router.get('/:id',AdminController.getSingleAdmin);
router.patch('/:id',validateRequest(updateAdminValidationSchema),AdminController.updateAdmin);
router.delete('/:id',AdminController.deleteAdmin)