// Student Management System Assignment Requirements
// Build A Student Management Application With The Following Features:
// 1.Store Student Information (Id, Name, Age, Grade)
// 2.Display The List Of Students
// 3.Add New Students To The List
// 4.Search For Students By Name
// 5.Display Statistics:
//  - Total Number Of Students
//  - Average Grade Of All Students
//  - Number Of Students By Classification: Excellent (≥ 8), Good (≥ 6.5), Average (< 6.5)
// 6.Save The Student List To A File (JSON)
// 7.Load The Student List From File On Startup
// The Application Should Have A Command-Line Interface That Allows Users To Select Functions Through An Interactive Menu.

const fs = require('fs');
const readline = require('readline');

const FILE_PATH = './students.json';
let students = [];

// Load students from file on startup
function loadStudents() {
    if (fs.existsSync(FILE_PATH)) {
        try {
            const data = fs.readFileSync(FILE_PATH, 'utf8');
            const parsedData = JSON.parse(data);
            students = Array.isArray(parsedData) ? parsedData : [];
            console.log("Student data loaded successfully.");
        } catch {
            console.log('Error parsing JSON file. Starting with an empty list.');
            students = [];
        }
    } else {
        console.log('No existing student data found. Starting with an empty list.');
    }
}

// Save students to file
function saveStudents() {
    fs.writeFileSync(FILE_PATH, JSON.stringify(students, null, 2));
    console.log('Student data saved successfully.');
}

// Display the list of students
function displayStudents() {
    console.log('\nStudent List:');
    if (students.length === 0) {
        console.log('No students found.');
        return;
    }

    console.log(' -------------------------------------------------');
    console.log('| ID   | Name                | Age  | Grade       |');
    console.log(' -------------------------------------------------');
    students.forEach(({ id, name, age, grade }) => {
        const formattedId = id.toString().padEnd(5);
        const formattedName = name.length > 18 ? name.slice(0, 15) + '...' : name.padEnd(18);
        const formattedAge = age.toString().padEnd(5);
        const formattedGrade = grade.toFixed(2).padEnd(10);
        console.log(`| ${formattedId} | ${formattedName} | ${formattedAge} | ${formattedGrade} |`);
    });
    console.log(' --------------------------------------------------');
}

// Add new students to the list
function addStudents(studentList) {
    if (!Array.isArray(studentList)) {
        console.log('Invalid input. Please provide an array of students.');
        return;
    }
    studentList.forEach(student => students.push(student));
    console.log(`${studentList.length} students added successfully.`);
}

// Search for students by name
function searchStudentByName(name) {
    const results = students.filter(student => student.name?.toLowerCase().includes(name.toLowerCase()));
    if (results.length > 0) {
        console.log('\nSearch Results:');
        results.forEach(({ id, name, age, grade }) => {
            console.log(`Id: ${id}, Name: ${name}, Age: ${age}, Grade: ${grade}`);
        });
    } else {
        console.log('No students found with the given name.');
    }
}

// Display statistics
function displayStatistics() {
    const totalStudents = students.length;
    const averageGrade = (students.reduce((sum, { grade }) => sum + grade, 0) / totalStudents || 0).toFixed(2);
    const classifications = {
        excellent: students.filter(({ grade }) => grade >= 8).length,
        good: students.filter(({ grade }) => grade >= 6.5 && grade < 8).length,
        average: students.filter(({ grade }) => grade < 6.5).length,
    };

    console.log('\nStatistics:');
    console.log(`Total Students: ${totalStudents}`);
    console.log(`Average Grade: ${averageGrade}`);
    console.log(`Excellent: ${classifications.excellent}, Good: ${classifications.good}, Average: ${classifications.average}`);
}

// Generate the next student ID
function generateNextId() {
    if (students.length === 0) return '1';
    const maxId = Math.max(...students.map(({ id }) => parseInt(id)));
    return (maxId + 1).toString();
}

// Prompt for student details
function promptForStudentDetails(rl, studentList = []) {
    rl.question('Enter student ID (leave blank for auto-generated): ', id => {
        if (!id) {
            id = generateNextId();
        } else if (students.some(student => student.id === id)) {
            console.log(`ID "${id}" already exists. Please try again.`);
            return promptForStudentDetails(rl, studentList);
        }

        rl.question('Enter student name: ', name => {
            if (!name.trim()) {
                console.log('Name cannot be empty. Please try again.');
                return promptForStudentDetails(rl, studentList);
            }

            rl.question('Enter student age: ', age => {
                age = parseInt(age);
                if (isNaN(age) || age <= 0) {
                    console.log('Invalid age. Please enter a positive number.');
                    return promptForStudentDetails(rl, studentList);
                }

                rl.question('Enter student grade: ', grade => {
                    grade = parseFloat(grade);
                    if (isNaN(grade) || grade < 0 || grade > 10) {
                        console.log('Invalid grade. Please enter a number between 0 and 10.');
                        return promptForStudentDetails(rl, studentList);
                    }

                    studentList.push({ id, name, age, grade });
                    rl.question('Do you want to add another student? (yes/no): ', answer => {
                        if (answer.toLowerCase() === 'yes') {
                            promptForStudentDetails(rl, studentList);
                        } else {
                            addStudents(studentList);
                            showMenu(rl);
                        }
                    });
                });
            });
        });
    });
}

// Display the menu
function showMenu(rl) {
    console.log('\n==============================================');
    console.log('           Student Management System           ');
    console.log('==============================================');
    console.log('1. Display Students');
    console.log('2. Add Student');
    console.log('3. Search Student By Name');
    console.log('4. Display Statistics');
    console.log('5. Save & Exit');
    console.log('==============================================');

    rl.question('Select an option (1-5): ', option => {
        switch (parseInt(option)) {
            case 1:
                displayStudents();
                break;
            case 2:
                promptForStudentDetails(rl);
                return;
            case 3:
                rl.question('Enter name to search: ', name => {
                    searchStudentByName(name);
                    showMenu(rl);
                });
                return;
            case 4:
                displayStatistics();
                break;
            case 5:
                saveStudents();
                console.log('Exiting...');
                rl.close();
                return;
            default:
                console.log('Invalid option. Please try again.');
        }
        showMenu(rl);
    });
}


function main() {
    console.log("Loading student data...");
    loadStudents();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    showMenu(rl);
}

main();

