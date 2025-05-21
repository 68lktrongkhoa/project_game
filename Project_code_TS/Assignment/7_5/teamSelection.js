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

    console.log('\n=== MEMBER LIST ===');
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

    console.log('\n=== EDIT SAMPLE LIST ===');
    console.log('Enter in the format: ID,Name,TypeID (TypeID: 1-Core Member, 2-Core Team, 3-Reserve Team, 4-Regular Members). Type "done" to finish editing.');

    function askForSampleEdit() {
        rl.question('> ', answer => {
            if (answer.trim().toLowerCase() === 'done') {
                rl.close();
                doneCallback();
                return;
            }
            const parts = answer.split(',');
            if (parts.length !== 3) {
                console.log('Invalid format. Please try again.');
                askForSampleEdit();
                return;
            }
            const id = parseInt(parts[0].trim());
            const name = parts[1].trim();
            const typeId = parseInt(parts[2].trim());

            if (isNaN(id) || isNaN(typeId) || ![1, 2, 3, 4].includes(typeId)) {
                console.log('Invalid ID or TypeID. Please try again.');
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

            console.log(`Updated: { id: ${id}, name: "${name}", type: "${typeMap[typeId]}" }`);
            askForSampleEdit();
        });
    }
    askForSampleEdit();
}

function initializeMembers(doneCallback) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\nHow would you like to create the member list?');
    console.log('1. Enter the member list.');
    console.log('2. Use the sample list.');
    console.log('3. Edit the sample list.');

    function askForInitializationChoice() {
        rl.question('Choose (1, 2, or 3): ', answer => {
            const trimmedAnswer = answer.trim();
            const choice = trimmedAnswer[0];

            if (!['1', '2', '3'].includes(choice)) {
                if (trimmedAnswer === '') {
                    console.log('❌ You didn\'t enter anything. Please enter 1, 2, or 3.');
                } else if (isNaN(choice)) {
                    console.log(`❌ "${trimmedAnswer}" is not a number. Please enter 1, 2, or 3.`);
                } else {
                    console.log(`❌ "${trimmedAnswer}" is not a valid choice. Please enter 1, 2, or 3.`);
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

                    console.log('\n✅ Sample list has been initialized.');
                    rl.close();
                    doneCallback();
                }],
                ['3', () => {
                    rl.close();
                    editSampleMembers(doneCallback);
                }],
                ['4', () => {
                    rl.question('Enter a list of IDs (separated by commas): ', answer => {
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

    console.log('\n=== ENTER MEMBER LIST ===');
    console.log('Enter in the format: ID,Name,TypeID (TypeID: 1-Core Member, 2-Core Team, 3-Reserve Team, 4-Regular Members). Type "done" to finish.');

    function askForMemberInput() {
        rl.question('> ', answer => {
            if (answer.trim().toLowerCase() === 'done') {
                rl.close();
                doneCallback();
                return;
            }
            const parts = answer.split(',');
            if (parts.length !== 3) {
                console.log('Invalid format. Please try again.');
                askForMemberInput();
                return;
            }
            const id = parseInt(parts[0].trim());
            const name = parts[1].trim();
            const typeId = parseInt(parts[2].trim());

            if (isNaN(id) || isNaN(typeId) || ![1, 2, 3, 4].includes(typeId)) {
                console.log('Invalid ID or TypeID. Please try again.');
                askForMemberInput();
                return;
            }

            if (typeId === 1) {
                if (members.coreMember) {
                    console.log('Core Member is already defined. Cannot add another.');
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

            console.log(`Added: { id: ${id}, name: "${name}", type: "${typeMap[typeId]}" }`);
            askForMemberInput();
        });
    }
    askForMemberInput();
}

function inputPairs(promptText, pairsArray, doneCallback) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`\n${promptText}`);
    console.log('Enter in the format: ID1,ID2 (e.g., 1,6). Type "done" to finish.');
    console.log('Note: IDs must be integers and cannot be the same.');
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
                console.log('Invalid format. Please try again.');
                askForPairInput();
                return;
            }
            const id1 = parseInt(parts[0].trim());
            const id2 = parseInt(parts[1].trim());
            if (isNaN(id1) || isNaN(id2) || id1 === id2) {
                console.log('Invalid or duplicate IDs. Please try again.');
                askForPairInput();
                return;
            }
            if (!isValidId(id1) || !isValidId(id2)) {
                console.log('❌ One or both IDs do not exist in the member list. Please try again.');
                askForPairInput();
                return;
            }
            pairsArray.push([id1, id2]);
            console.log(`Added pair: [${id1}, ${id2}]`);
            askForPairInput();
        });
    }
    askForPairInput();
}

function generateTeams() {
    console.log('\n=== GENERATE TEAM ===');
    const teams = [];

    if (members.coreMember && members.coreTeam.length > 0 && members.reserveTeam.length > 0) {
        console.log("Generating teams from Core Member, Core Team, and Reserve Team...");

        members.coreTeam.forEach(core => {
            members.reserveTeam.forEach(reserve => {
                const team = [members.coreMember, core, reserve];

                if (violatesCannotPlay(team) ) return;
                if (!satisfiesMustPlay(team)) return;

                teams.push(team.map(m => ({ id: m.id, name: m.name })));
            });
        });

        if (teams.length === 0) {
            console.log('❌ Unable to create any teams that satisfy the given conditions.');
        } else {
            console.log(`✅ Successfully created ${teams.length} teams that satisfy the conditions.`);
        }
    } else {
        console.log('❌ Missing members to create teams (Core Member, Core Team, or Reserve Team is incomplete).');
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
        console.log('\n❌ No teams were formed.');
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

    console.log('\n=== TEAM LIST ===');
    console.log(table.toString());
}

function askToContinue() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    function ask() {
        rl.question('\n🔄 Do you want to continue creating teams? (yes/no): ', answer => {
            const normalizedAnswer = answer.trim().toLowerCase();

            if (normalizedAnswer === 'yes') {
                console.log('\n🔁 Restarting the team creation process...\n');
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
            } else if (normalizedAnswer === 'no') {
                console.log('\n👋 Program ended. Thank you for using it!');
                rl.close();
                process.exit(0);
            } else {
                console.log('❌ Invalid choice. Please enter "yes" or "no".');
                ask();
            }
        });
    }

    ask();
}

//Xuất hiện thêm ông hiệu trưởng. Ổng hỏi bạn 1-7-17 lập đội được không, dùng tool trả lời ổng đc hay không và vì sao

function canFormTeam(ids) {
    if (ids.length !== 3) {
        console.log('❌ The team must have exactly 3 members.');
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
        console.log('❌ One or more IDs do not exist in the member list.');
        return false;
    }

    if (violatesCannotPlay(membersInTeam)) {
        console.log('❌ The team violates the condition of NOT playing together.');
        console.log('🔍 NOT playing together condition:');
        cannotPlayTogether.forEach(([id1, id2]) => {
            if (ids.includes(id1) && ids.includes(id2)) {
                console.log(`- Member ID ${id1} and ID ${id2} cannot play together.`);
            }
        });
        return false;
    }

    if (!satisfiesMustPlay(membersInTeam)) {
        console.log('❌ The team does not satisfy the MUST play together condition.');
        console.log('🔍 MUST play together condition:');
        mustPlayTogether.forEach(([id1, id2]) => {
            if ((ids.includes(id1) && !ids.includes(id2)) || (ids.includes(id2) && !ids.includes(id1))) {
                console.log(`- Member ID ${id1} and ID ${id2} must play together, but not both are present.`);
            }
        });
        return false;
    }

    console.log('✅ The team can be formed.');
    return true;
}

function main() {
    initializeMembers(() => {
        displayMembers();

        inputPairs(
            'Enter pairs that MUST play together',
            mustPlayTogether,
            () => {
                inputPairs(
                    'Enter pairs that CANNOT play together',
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
                            console.log('\n=== MEMBERS NOT ASSIGNED TO TEAMS ===');
                        
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
                        
                            rl.question('Principal asks: Enter a list of IDs to check the team (separated by commas): ', answer => {
                                const ids = answer.split(',').map(id => parseInt(id.trim()));
                        
                                if (ids.some(isNaN)) {
                                    console.log('❌ Invalid ID list. Please try again.');
                                } else {
                                    const result = canFormTeam(ids);
                                    if (!result) {
                                        console.log('❌ The team cannot be formed. Violates constraints.');
                                    }
                                }
                        
                                rl.close();
                                askToContinue();
                            });
                        } else {
                            console.log('\n✅ All members have been assigned to teams.');
                            askToContinue();
                        }
                    }
                );
            }
        );
    });
}

main();