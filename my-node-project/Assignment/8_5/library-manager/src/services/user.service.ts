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

  findUserById(id: any): User | null {
    return this.userRepository.findById(id);
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