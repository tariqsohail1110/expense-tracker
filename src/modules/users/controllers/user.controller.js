import { UserService } from "../services/user.service.js";
import { UserResponseDto } from "../dtos/user-response.dto.js";

export class UserController {
    constructor() {
        this.userService = new UserService();
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getById = this.getById.bind(this);
        this.getByEmail = this.getByEmail.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }
    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAll();
            res.status(200).json({ data: UserResponseDto(users) });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getById(id);
            res.status(200).json({ data: UserResponseDto(user)}); 
        }catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    getByEmail = async (req, res) => {
        try {
            const { email } = req.query;
            const user = await this.userService.getByEmail(email);
            res.status(200).json({ data: UserResponseDto(user) });
        }catch(error) {
            res.status(404).json({ message: error.message });
        }
    }

    createUser = async (req, res) => {
        try {
            const data = req.body;
            const user = await this.userService.createUser(data);
            res.status(201).json({ data: UserResponseDto(user) });
        }catch(error) {
            res.status(400).json({ message: error.message });
        }
    }

    updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const user = await this.userService.update(id, data);
            res.status(201).json({ data: UserResponseDto(user) });
        }catch(error) {
            res.status(400).json({ message: error.message });
        }
    }

    deleteUser = async (req, res) => {
        try{
            const { id } = req.params;
            await this.userService.deleteUser(id);
            res.status(200).json({ message: "User deleted succesfully!" });
        }catch(error) {
            res.status(400).json({ message: error.message });
        }
    }
}