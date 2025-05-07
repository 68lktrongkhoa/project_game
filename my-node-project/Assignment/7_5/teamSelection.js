const readline = require('readline');
const Table = require('cli-table3'); // Thư viện hiển thị bảng

let members = {
    coreMember: null,
    coreTeam: [],
    reserveTeam: [],
};

let mustPlayTogether = [];
let cannotPlayTogether = [];

// Hàm hiển thị danh sách thành viên dưới dạng bảng
function displayMembers() {
    const table = new Table({
        head: ['ID', 'Name', 'Type'],
        colWidths: [10, 30, 20],
    });

    if (members.coreMember) {
        table.push([members.coreMember.id, members.coreMember.name, 'Core Member']);
    }
    members.coreTeam.forEach(member => {
        table.push([member.id, member.name, 'Core Team']);
    });
    members.reserveTeam.forEach(member => {
        table.push([member.id, member.name, 'Reserve Team']);
    });

    console.log('\n=== Danh sách thành viên ===');
    console.log(table.toString());
}

// Hàm nhập danh sách thành viên
function inputMembers(doneCallback) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\n=== Nhập danh sách thành viên ===');
    console.log('Nhập theo định dạng: ID,Name,Type (Type: coreMember, coreTeam, reserveTeam). Gõ "done" để kết thúc nhập.');

    function ask() {
        rl.question('> ', answer => {
            if (answer.trim().toLowerCase() === 'done') {
                rl.close();
                doneCallback();
                return;
            }
            const parts = answer.split(',');
            if (parts.length !== 3) {
                console.log('Định dạng không đúng. Vui lòng nhập lại.');
                ask();
                return;
            }
            const id = parseInt(parts[0].trim());
            const name = parts[1].trim();
            const type = parts[2].trim();

            if (isNaN(id) || !['coreMember', 'coreTeam', 'reserveTeam'].includes(type)) {
                console.log('ID không hợp lệ hoặc Type không đúng. Vui lòng nhập lại.');
                ask();
                return;
            }

            if (type === 'coreMember') {
                if (members.coreMember) {
                    console.log('Core Member đã được định nghĩa. Không thể thêm nữa.');
                } else {
                    members.coreMember = { id, name };
                }
            } else if (type === 'coreTeam') {
                members.coreTeam.push({ id, name });
            } else if (type === 'reserveTeam') {
                members.reserveTeam.push({ id, name });
            }

            console.log(`Đã thêm: { id: ${id}, name: "${name}", type: "${type}" }`);
            ask();
        });
    }
    ask();
}

// Hàm nhập các cặp (phải chơi cùng hoặc không được chơi cùng)
function inputPairs(promptText, pairsArray, doneCallback) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`\n${promptText}`);
    console.log('Nhập theo định dạng: ID1,ID2 (ví dụ: 1,6). Gõ "done" để kết thúc nhập.');

    function ask() {
        rl.question('> ', answer => {
            if (answer.trim().toLowerCase() === 'done') {
                rl.close();
                doneCallback();
                return;
            }
            const parts = answer.split(',');
            if (parts.length !== 2) {
                console.log('Định dạng không đúng. Vui lòng nhập lại.');
                ask();
                return;
            }
            const id1 = parseInt(parts[0].trim());
            const id2 = parseInt(parts[1].trim());
            if (isNaN(id1) || isNaN(id2) || id1 === id2) {
                console.log('ID không hợp lệ hoặc trùng nhau. Vui lòng nhập lại.');
                ask();
                return;
            }
            pairsArray.push([id1, id2]);
            console.log(`Đã thêm cặp: [${id1}, ${id2}]`);
            ask();
        });
    }
    ask();
}

// Hàm sinh đội (giả định, cần logic cụ thể)
function generateTeams() {
    console.log('\n=== Sinh đội ===');
    console.log('Chức năng này cần được triển khai.');
    return [];
}

// Hàm in danh sách đội
function printTeams(teams) {
    const table = new Table({
        head: ['Team #', 'Members'],
        colWidths: [10, 50],
    });

    teams.forEach((team, index) => {
        table.push([`Team ${index + 1}`, team.join(', ')]);
    });

    console.log('\n=== Danh sách đội ===');
    console.log(table.toString());
}

// Hỏi người dùng có muốn tiếp tục không
function askToContinue() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('\n🔄 Bạn có muốn tiếp tục tạo đội không? (có/không): ', answer => {
        rl.close();
        if (answer.trim().toLowerCase() === 'có') {
            console.log('\n🔁 Bắt đầu lại quá trình tạo đội...\n');
            mustPlayTogether = [];
            cannotPlayTogether = [];
            start();
        } else {
            console.log('\n👋 Chương trình kết thúc. Cảm ơn bạn đã sử dụng!');
            process.exit(0);
        }
    });
}

// Bắt đầu chương trình
function start() {
    inputMembers(() => {
        displayMembers(); // Hiển thị danh sách thành viên dưới dạng bảng

        inputPairs(
            'Nhập các cặp PHẢI chơi cùng nhau',
            mustPlayTogether,
            () => {
                inputPairs(
                    'Nhập các cặp KHÔNG được chơi cùng nhau',
                    cannotPlayTogether,
                    () => {
                        const teams = generateTeams();
                        printTeams(teams);
                        askToContinue();
                    }
                );
            }
        );
    });
}

start();