import { AdminResponseDto } from "../dtos/admin-response.dto.js";
import { AdminService } from "../services/admin.service.js";

export class AdminController {
    constructor() {
        this.adminService = new AdminService();
    }

    getAllAdmins = async (req, res) => {
        try {
            const admins = await this.adminService.getAllAdmins();
            res.status(200).json({ data: admins.map(admin => AdminResponseDto(admin)) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    getAdminById = async (req, res) => {
        try {
            const { id } = req.params;
            const admin = await this.adminService.getAdminById(id);
            res.status(200).json({ data: AdminResponseDto(admin) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }

    getAdminByEmail = async (req, res) => {
        try {
            const { email } = req.query;
            const admin = await this.adminService.getAdminByEmail(email);
            res.status(200).json({ data: AdminResponseDto(admin) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }

    createAdmin = async (req, res) => {
        try {
            const data = req.body;
            const admin = await this.adminService.createAdmin(data);
            res.status(201).json({ data: AdminResponseDto(admin) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    updateAdmin = async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const admin = await this.adminService.updateAdmin(id, data);
            res.status(201).json({ data: AdminResponseDto(admin) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    changeRole = async (req, res) => {
        try {
            const { id } = req.params;
            const role = req.body;
            const admin = await this.adminService.changeRole(id, role);
            res.status(201).json({ data: AdminResponseDto(admin) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    deleteAdmin = async (req, res) => {
        try {
            const { id } = req.params;
            await this.adminService.deleteAdmin(id);
            res.status(200).json({ message: 'Admin deleted successfully!' });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }
}