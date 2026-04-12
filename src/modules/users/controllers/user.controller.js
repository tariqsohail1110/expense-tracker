import { UserService } from "../services/user.service.js";
import { UserResponseDto } from "../dtos/user-response.dto.js";

export class UserController {
    constructor() {
        this.userService = new UserService();
    }
    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAll();
            res.status(200).json({ data: users.map(user => UserResponseDto(user)) });
        } catch (error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getById(id);
            res.status(200).json({ data: UserResponseDto(user)}); 
        }catch (error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }

    getByEmail = async (req, res) => {
        try {
            const { email } = req.query;
            // console.log(`Email received ${email}`);
            const user = await this.userService.getByEmail(email);
            res.status(200).json({ data: UserResponseDto(user) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }

    createUser = async (req, res) => {
        try {
            const data = req.body;
            const user = await this.userService.createUser(data);
            res.status(201).json({ data: UserResponseDto(user) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const user = await this.userService.update(id, data);
            res.status(201).json({ data: UserResponseDto(user) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    deleteUser = async (req, res) => {
        try{
            const { id } = req.params;
            await this.userService.deleteUser(id);
            res.status(200).json({ message: "User deleted succesfully!" });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    getMe = async (req, res) => {
        try {
            const id = req.user.sub;
            const user = await this.userService.getById(id);
            res.status(200).json({ data: UserResponseDto(user)}); 
        }catch (error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }

    updateMe = async (req, res) => {
        try {
            const id = req.user.sub;
            const data = req.body;
            const user = await this.userService.update(id, data);
            res.status(201).json({ data: UserResponseDto(user) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    deleteMe = async (req, res) => {
        try{
            const id = req.user.sub;
            await this.userService.deleteUser(id);
            res.status(200).json({ message: "User deleted succesfully!" });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }
}