import { User } from '../models/user';
import { Repository } from '../repository/repository';
import Table from 'cli-table3';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  addUser(userData: Omit<User, 'id'>): User {
    return this.userRepository.add(userData);
  }

  getAllUsers(): User[] {
      return this.userRepository.getAll();
  }

  getUserById(idInput: string | number): User | null {
    let numericId: number;

    if (typeof idInput === 'string') {
      numericId = parseInt(idInput, 10);
      if (isNaN(numericId)) {
        console.error(`Lỗi: ID người dùng không hợp lệ được cung cấp cho findUserById: "${idInput}"`);
        return null;
      }
    } else if (typeof idInput === 'number') {
      numericId = idInput;
    } else {
      console.error(`Lỗi: Kiểu ID người dùng không hợp lệ được cung cấp cho findUserById: ${typeof idInput}`);
      return null;
    }
    return this.userRepository.findById(numericId);
  }

   displayUsers(users: User[]): void {
     if (!users || users.length === 0) {
         console.log("  Không có người dùng nào để hiển thị.");
         return;
     }
       const table = new Table({
           head: ['ID', 'Tên', 'Mã thành viên'], 
           colWidths: [5, 30, 15]
       });
       users.forEach(user => {
           table.push([user.id, user.name, user.memberId]);
       });
       console.log(table.toString());
   }
}