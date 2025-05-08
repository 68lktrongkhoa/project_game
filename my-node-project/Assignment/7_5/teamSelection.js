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

    const typeMap = {
        1: 'Core Member',
        2: 'Core Team',
        3: 'Reserve Team',
        4: 'Regular Member'
    };

    console.log('\n=== Chỉnh sửa danh sách mẫu ===');
    console.log('Nhập theo định dạng: ID,Name,TypeID (TypeID: 1-Core Member, 2-Core Team, 3-Reserve Team, 4-Regular Members). Gõ "done" để kết thúc chỉnh sửa.');

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
            const typeId = parseInt(parts[2].trim());

            if (isNaN(id) || isNaN(typeId) || ![1, 2, 3, 4].includes(typeId)) {
                console.log('ID hoặc TypeID không hợp lệ. Vui lòng nhập lại.');
                askForSampleEdit();
                return;
            }

            if (typeId === 1) {
                members.coreMember = { id, name };
            } else if (typeId === 2) {
                const index = members.coreTeam.findIndex(member => member.id === id);
                if (index !== -1) {
                    members.coreTeam[index] = { id, name };
                } else {
                    members.coreTeam.push({ id, name });
                }
            } else if (typeId === 3) {
                const index = members.reserveTeam.findIndex(member => member.id === id);
                if (index !== -1) {
                    members.reserveTeam[index] = { id, name };
                } else {
                    members.reserveTeam.push({ id, name });
                }
            } else if (typeId === 4) {
                const index = members.regularMembers.findIndex(member => member.id === id);
                if (index !== -1) {
                    members.regularMembers[index] = { id, name };
                } else {
                    members.regularMembers.push({ id, name });
                }
            }

            console.log(`Đã cập nhật: { id: ${id}, name: "${name}", type: "${typeMap[typeId]}" }`);
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
                }],
                ['4', () => {
                    rl.question('Nhập danh sách ID (phân cách bằng dấu phẩy): ', answer => {
                        const ids = answer.split(',').map(id => parseInt(id.trim()));
                        canFormTeam(ids);
                        rl.close();
                        doneCallback();
                    });
                }]
            ]);

            actions.get(choice)();
        });
    }
    askForInitializationChoice();
}

function inputMembers(doneCallback) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const typeMap = {
        1: 'Core Member',
        2: 'Core Team',
        3: 'Reserve Team',
        4: 'Regular Member'
    };

    console.log('\n=== Nhập danh sách thành viên ===');
    console.log('Nhập theo định dạng: ID,Name,TypeID (TypeID: 1-Core Member, 2-Core Team, 3-Reserve Team, 4-Regular Members). Gõ "done" để kết thúc nhập.');

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
            const typeId = parseInt(parts[2].trim());

            if (isNaN(id) || isNaN(typeId) || ![1, 2, 3, 4].includes(typeId)) {
                console.log('ID hoặc TypeID không hợp lệ. Vui lòng nhập lại.');
                askForMemberInput();
                return;
            }

            if (typeId === 1) {
                if (members.coreMember) {
                    console.log('Core Member đã được định nghĩa. Không thể thêm nữa.');
                } else {
                    members.coreMember = { id, name };
                }
            } else if (typeId === 2) {
                members.coreTeam.push({ id, name });
            } else if (typeId === 3) {
                members.reserveTeam.push({ id, name });
            } else if (typeId === 4) {
                members.regularMembers.push({ id, name });
            }

            console.log(`Đã thêm: { id: ${id}, name: "${name}", type: "${typeMap[typeId]}" }`);
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
        const formattedMembers = team.map(member => `${member.id} - ${member.name}`).join(', ');
        table.push([`Team ${index + 1}`, formattedMembers]);
    });

    console.log('\n=== Danh sách đội ===');
    console.log(table.toString());
}

function askToContinue() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    function ask() {
        rl.question('\n🔄 Bạn có muốn tiếp tục tạo đội không? (có/không): ', answer => {
            const normalizedAnswer = answer.trim().toLowerCase();

            if (normalizedAnswer === 'có') {
                console.log('\n🔁 Bắt đầu lại quá trình tạo đội...\n');
                mustPlayTogether = [];
                cannotPlayTogether = [];
                members = {
                    coreMember: null,
                    coreTeam: [],
                    reserveTeam: [],
                    regularMembers: []
                };

                rl.close();
                main();
            } else if (normalizedAnswer === 'không') {
                console.log('\n👋 Chương trình kết thúc. Cảm ơn bạn đã sử dụng!');
                rl.close();
                process.exit(0);
            } else {
                console.log('❌ Lựa chọn không hợp lệ. Vui lòng nhập "có" hoặc "không".');
                ask();
            }
        });
    }

    ask();
}

//Xuất hiện thêm ông hiệu trưởng. Ổng hỏi bạn 1-7-17 lập đội được không, dùng tool trả lời ổng đc hay không và vì sao

function canFormTeam(ids) {
    if (ids.length !== 3) {
        console.log('❌ Nhóm phải có đúng 3 thành viên.');
        return false;
    }

    const membersInTeam = ids.map(id => {
        return (
            members.coreMember?.id === id ? members.coreMember :
            members.coreTeam.find(member => member.id === id) ||
            members.reserveTeam.find(member => member.id === id) ||
            members.regularMembers.find(member => member.id === id)
        );
    });

    if (membersInTeam.includes(undefined)) {
        console.log('❌ Một hoặc nhiều ID không tồn tại trong danh sách thành viên.');
        return false;
    }

    if (violatesCannotPlay(membersInTeam)) {
        console.log('❌ Nhóm vi phạm điều kiện KHÔNG được chơi cùng nhau.');
        console.log('🔍 Điều kiện KHÔNG được chơi cùng nhau:');
        cannotPlayTogether.forEach(([id1, id2]) => {
            if (ids.includes(id1) && ids.includes(id2)) {
                console.log(`- Thành viên ID ${id1} và ID ${id2} không được chơi cùng nhau.`);
            }
        });
        return false;
    }

    if (!satisfiesMustPlay(membersInTeam)) {
        console.log('❌ Nhóm không thỏa mãn điều kiện PHẢI chơi cùng nhau.');
        console.log('🔍 Điều kiện PHẢI chơi cùng nhau:');
        mustPlayTogether.forEach(([id1, id2]) => {
            if ((ids.includes(id1) && !ids.includes(id2)) || (ids.includes(id2) && !ids.includes(id1))) {
                console.log(`- Thành viên ID ${id1} và ID ${id2} phải chơi cùng nhau, nhưng không đủ cả hai.`);
            }
        });
        return false;
    }

    console.log('✅ Nhóm có thể lập đội.');
    return true;
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

                        //Filter out the teams that have members in the reserve team
                        const allTeamMembers = new Set(
                            teams.flatMap(team => team.map(member => member.id))
                        );
                        const remainingMembers = [
                            members.coreMember,
                            ...members.coreTeam,
                            ...members.reserveTeam,
                            ...members.regularMembers
                        ].filter(member => member && !allTeamMembers.has(member.id));

                        if (remainingMembers.length > 0) {
                            console.log('\n=== Các thành viên chưa được lập đội ===');
                        
                            // Tạo bảng hiển thị các thành viên chưa được lập đội
                            const table = new Table({
                                head: ['ID', 'Name', 'Type'],
                                colWidths: [10, 30, 20],
                            });
                        
                            remainingMembers.forEach(member => {
                                let type = 'Unknown';
                                if (member === members.coreMember) {
                                    type = 'Core Member';
                                } else if (members.coreTeam.includes(member)) {
                                    type = 'Core Team';
                                } else if (members.reserveTeam.includes(member)) {
                                    type = 'Reserve Team';
                                } else if (members.regularMembers.includes(member)) {
                                    type = 'Regular Member';
                                }
                                table.push([member.id, member.name, type]);
                            });
                        
                            console.log(table.toString());
                        
                            // The principal asked if you could team up with the rest of the members.
                            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                        
                            rl.question('Hiệu trưởng hỏi: Nhập danh sách ID để kiểm tra nhóm (phân cách bằng dấu phẩy): ', answer => {
                                const ids = answer.split(',').map(id => parseInt(id.trim()));
                        
                                if (ids.some(isNaN)) {
                                    console.log('❌ Danh sách ID không hợp lệ. Vui lòng nhập lại.');
                                } else {
                                    const result = canFormTeam(ids);
                                    if (!result) {
                                        console.log('❌ Nhóm không thể lập đội. Vi phạm điều kiện ràng buộc.');
                                    }
                                }
                        
                                rl.close();
                                askToContinue();
                            });
                        } else {
                            console.log('\n✅ Tất cả thành viên đã được lập đội.');
                            askToContinue();
                        }
                    }
                );
            }
        );
    });
}

main();