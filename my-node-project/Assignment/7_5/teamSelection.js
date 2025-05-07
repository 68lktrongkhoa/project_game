const readline = require('readline');
const Table = require('cli-table3');

let members = {
    coreMember: null,
    coreTeam: [],
    reserveTeam: [],
    regularMembers: []
};

let mustPlayTogether = [];
let cannotPlayTogether = [];

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
    members.regularMembers.forEach(member => {
        table.push([member.id, member.name, 'Regular Member']); 
    });

    console.log('\n=== Danh sách thành viên ===');
    console.log(table.toString());
}

function editSampleMembers(doneCallback) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\n=== Chỉnh sửa danh sách mẫu ===');
    console.log('Nhập theo định dạng: ID,Name,Type (Type: coreMember, coreTeam, reserveTeam, regularMembers). Gõ "done" để kết thúc chỉnh sửa.');
    console.log('Lưu ý: Nếu ID đã tồn tại, thông tin sẽ được cập nhật. Nếu ID không tồn tại, thành viên mới sẽ được thêm.');

    function askForSampleEdit() {
        rl.question('> ', answer => {
            if (answer.trim().toLowerCase() === 'done') {
                rl.close();
                doneCallback();
                return;
            }
            const parts = answer.split(',');
            if (parts.length !== 3) {
                console.log('Định dạng không đúng. Vui lòng nhập lại.');
                askForSampleEdit();
                return;
            }
            const id = parseInt(parts[0].trim());
            const name = parts[1].trim();
            const type = parts[2].trim();

            if (isNaN(id) || !['coreMember', 'coreTeam', 'reserveTeam', 'regularMembers'].includes(type)) {
                console.log('ID không hợp lệ hoặc Type không đúng. Vui lòng nhập lại.');
                askForSampleEdit();
                return;
            }

            if (type === 'coreMember') {
                members.coreMember = { id, name };
            } else if (type === 'coreTeam') {
                const index = members.coreTeam.findIndex(member => member.id === id);
                if (index !== -1) {
                    members.coreTeam[index] = { id, name };
                } else {
                    members.coreTeam.push({ id, name });
                }
            } else if (type === 'reserveTeam') {
                const index = members.reserveTeam.findIndex(member => member.id === id);
                if (index !== -1) {
                    members.reserveTeam[index] = { id, name };
                } else {
                    members.reserveTeam.push({ id, name });
                }
            } else if (type === 'regularMembers') {
                const index = members.regularMembers.findIndex(member => member.id === id);
                if (index !== -1) {
                    members.regularMembers[index] = { id, name };
                } else {
                    members.regularMembers.push({ id, name });
                }
            }

            console.log(`Đã cập nhật: { id: ${id}, name: "${name}", type: "${type}" }`);
            askForSampleEdit();
        });
    }
    askForSampleEdit();
}

function initializeMembers(doneCallback) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\nChọn cách tạo danh sách thành viên?');
    console.log('1. Nhập danh sách thành viên.');
    console.log('2. Lấy danh sách mẫu.');
    console.log('3. Chỉnh sửa danh sách mẫu.');

    function askForInitializationChoice() {
        rl.question('Chọn (1, 2 hoặc 3): ', answer => {
            const trimmedAnswer = answer.trim();
            const choice = trimmedAnswer[0];

            if (!['1', '2', '3'].includes(choice)) {
                if (trimmedAnswer === '') {
                    console.log('❌ Bạn chưa nhập gì. Vui lòng nhập 1, 2 hoặc 3.');
                } else if (isNaN(choice)) {
                    console.log(`❌ "${trimmedAnswer}" không phải là số. Vui lòng nhập 1, 2 hoặc 3.`);
                } else {
                    console.log(`❌ "${trimmedAnswer}" không phải là lựa chọn hợp lệ. Vui lòng nhập 1, 2 hoặc 3.`);
                }
                rl.close();
                initializeMembers(doneCallback);
                return;
            }

            const actions = new Map([
                ['1', () => {
                    rl.close();
                    inputMembers(doneCallback);
                }],
                ['2', () => {
                    members = {
                        coreMember: { id: 0, name: 'Core Member' },
                        coreTeam: [
                            { id: 1, name: 'Core Team Member 1' },
                            { id: 2, name: 'Core Team Member 2' },
                            { id: 3, name: 'Core Team Member 3' },
                            { id: 4, name: 'Core Team Member 4' },
                            { id: 5, name: 'Core Team Member 5' },
                        ],
                        reserveTeam: [
                            { id: 6, name: 'Reserve Member 1' },
                            { id: 7, name: 'Reserve Member 2' },
                            { id: 8, name: 'Reserve Member 3' },
                            { id: 9, name: 'Reserve Member 4' },
                            { id: 10, name: 'Reserve Member 5' },
                        ],
                        regularMembers: Array.from({ length: 29 }, (_, i) => ({
                            id: i + 11,
                            name: `Regular Member ${i + 1}`
                        }))
                    };

                    console.log('\n✅ Danh sách mẫu đã được khởi tạo.');
                    rl.close();
                    doneCallback();
                }],
                ['3', () => {
                    rl.close();
                    editSampleMembers(doneCallback);
                }]
            ]);

            actions.get(choice)();
        });
    }
    askForInitializationChoice();
}

function inputMembers(doneCallback) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\n=== Nhập danh sách thành viên ===');
    console.log('Nhập theo định dạng: ID,Name,Type (Type: coreMember, coreTeam, reserveTeam, regularMembers). Gõ "done" để kết thúc nhập.');

    function askForMemberInput() {
        rl.question('> ', answer => {
            if (answer.trim().toLowerCase() === 'done') {
                rl.close();
                doneCallback();
                return;
            }
            const parts = answer.split(',');
            if (parts.length !== 3) {
                console.log('Định dạng không đúng. Vui lòng nhập lại.');
                askForMemberInput();
                return;
            }
            const id = parseInt(parts[0].trim());
            const name = parts[1].trim();
            const type = parts[2].trim();

            if (isNaN(id) || !['coreMember', 'coreTeam', 'reserveTeam', 'regularMembers'].includes(type)) {
                console.log('ID không hợp lệ hoặc Type không đúng. Vui lòng nhập lại.');
                askForMemberInput();
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
            } else if (type === 'regularMembers') {
                members.regularMembers.push({ id, name });
            }

            console.log(`Đã thêm: { id: ${id}, name: "${name}", type: "${type}" }`);
            askForMemberInput();
        });
    }
    askForMemberInput();
}

function inputPairs(promptText, pairsArray, doneCallback) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`\n${promptText}`);
    console.log('Nhập theo định dạng: ID1,ID2 (ví dụ: 1,6). Gõ "done" để kết thúc nhập.');
    console.log('Lưu ý: ID phải là số nguyên và không được trùng nhau.');
    function isValidId(id) {
        if (members.coreMember && members.coreMember.id === id) return true;
        if (members.coreTeam.some(member => member.id === id)) return true;
        if (members.reserveTeam.some(member => member.id === id)) return true;
        if (members.regularMembers.some(member => member.id === id)) return true;
        return false;
    }

    function askForPairInput() {
        rl.question('> ', answer => {
            if (answer.trim().toLowerCase() === 'done') {
                rl.close();
                doneCallback();
                return;
            }
            const parts = answer.split(',');
            if (parts.length !== 2) {
                console.log('Định dạng không đúng. Vui lòng nhập lại.');
                askForPairInput();
                return;
            }
            const id1 = parseInt(parts[0].trim());
            const id2 = parseInt(parts[1].trim());
            if (isNaN(id1) || isNaN(id2) || id1 === id2) {
                console.log('ID không hợp lệ hoặc trùng nhau. Vui lòng nhập lại.');
                askForPairInput();
                return;
            }
            if (!isValidId(id1) || !isValidId(id2)) {
                console.log('❌ Một hoặc cả hai ID không tồn tại trong danh sách thành viên. Vui lòng nhập lại.');
                askForPairInput();
                return;
            }
            pairsArray.push([id1, id2]);
            console.log(`Đã thêm cặp: [${id1}, ${id2}]`);
            askForPairInput();
        });
    }
    askForPairInput();
}

function generateTeams() {
    console.log('\n=== Sinh đội ===');
    const teams = [];

    if (members.coreMember && members.coreTeam.length > 0 && members.reserveTeam.length > 0) {
        console.log("Đang sinh đội từ Core Member, Core Team và Reserve Team...");

        members.coreTeam.forEach(core => {
            members.reserveTeam.forEach(reserve => {
                const team = [members.coreMember, core, reserve];

                if (violatesCannotPlay(team) ) return;
                if (!satisfiesMustPlay(team)) return;

                teams.push(team.map(m => ({ id: m.id, name: m.name })));
            });
        });

        if (teams.length === 0) {
            console.log('❌ Không thể tạo đội nào thỏa mãn các điều kiện đã cho.');
        } else {
            console.log(`✅ Đã tạo được ${teams.length} đội thỏa mãn điều kiện.`);
        }
    } else {
        console.log('❌ Thiếu thành viên để tạo đội (Core Member, Core Team hoặc Reserve Team chưa đầy đủ).');
    }

    return teams;
}

function violatesCannotPlay(team) {
    return cannotPlayTogether.some(([id1, id2]) => {
        const ids = team.map(m => m.id);
        return ids.includes(id1) && ids.includes(id2);
    });
}

function satisfiesMustPlay(team) {
    return mustPlayTogether.every(([id1, id2]) => {
        const ids = team.map(m => m.id);
        return !(ids.includes(id1) && !ids.includes(id2)) && !(ids.includes(id2) && !ids.includes(id1));
    });
}


function printTeams(teams) {
    if (!Array.isArray(teams) || teams.length === 0) {
        console.log('\n❌ Không có đội nào được thành lập.');
        return;
    }

    const table = new Table({
        head: ['Team #', 'Members'],
        colWidths: [10, 60],
    });

    teams.forEach((team, index) => {
        table.push([`Team ${index + 1}`, team.join(', ')]);
    });

    console.log('\n=== Danh sách đội ===');
    console.log(table.toString());
}

function askToContinue() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    function ask() {
        rl.question('\n🔄 Bạn có muốn tiếp tục tạo đội không? (có/không): ', answer => {
            const normalizedAnswer = answer.trim().toLowerCase();

            if (normalizedAnswer === 'có' ) {
                console.log('\n🔁 Bắt đầu lại quá trình tạo đội...\n');
                mustPlayTogether = [];
                cannotPlayTogether = [];
                main();
            } else if (normalizedAnswer === 'không' ) {
                console.log('\n👋 Chương trình kết thúc. Cảm ơn bạn đã sử dụng!');
                process.exit(0);
            } else {
                console.log('❌ Lựa chọn không hợp lệ. Vui lòng nhập "có" hoặc "không".');
                ask();
            }
        });
    }

    ask();
}

function main() {
    initializeMembers(() => {
        displayMembers();

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

main();