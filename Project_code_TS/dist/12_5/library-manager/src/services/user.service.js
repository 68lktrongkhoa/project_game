"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    addUser(userData) {
        return this.userRepository.add(userData);
    }
    getAllUsers() {
        return this.userRepository.getAll();
    }
    getUserById(idInput) {
        let numericId;
        if (typeof idInput === 'string') {
            numericId = parseInt(idInput, 10);
            if (isNaN(numericId)) {
                console.error(`Lỗi: ID người dùng không hợp lệ được cung cấp cho findUserById: "${idInput}"`);
                return null;
            }
        }
        else if (typeof idInput === 'number') {
            numericId = idInput;
        }
        else {
            console.error(`Lỗi: Kiểu ID người dùng không hợp lệ được cung cấp cho findUserById: ${typeof idInput}`);
            return null;
        }
        return this.userRepository.findById(numericId);
    }
    displayUsers(users) {
        if (!users || users.length === 0) {
            console.log("  Không có người dùng nào để hiển thị.");
            return;
        }
        const table = new cli_table3_1.default({
            head: ['ID', 'Tên', 'Mã thành viên'],
            colWidths: [5, 30, 15]
        });
        users.forEach(user => {
            table.push([user.id, user.name, user.memberId]);
        });
        console.log(table.toString());
    }
}
exports.UserService = UserService;
