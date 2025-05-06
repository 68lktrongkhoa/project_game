////How to run: cd to forder Asignment/6_5 and run the command: node ex2.js

//Baì 1: Write a function to caculate the combination (Ckn)
function combination(n, k) {
    if (k > n || n < 0 || k < 0) return 0;
    
    k = Math.min(k, n - k);  
    let result = 1;
    
    for (let i = 1; i <= k; i++) {
        result *= (n - (k - i));
        result /= i;
    }
    
    return result;
}


// //Bài 2: Write to funtion to get the random interger between 2 numbers: max, min; 
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Bài 3: Write the function to get the random element from an array. 
function getRandomElement(arr) {
    if (arr.length === 0) return null; 
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}



//Bài 4: Give two arrays of intergers, find which elemnets in the second array are not in the first array.
function findMissingElements(arr1, arr2) {
    const missingElements = arr2.filter(element => !arr1.includes(element));
    return missingElements;
}



//Run the results of each lesson, run each lesson and remove the comment of that lesson.
// //Bai 1: 
console.log('Answer 1: ',combination(5, 2)); 

// //Bai 2: 
// console.log('Answer 2: ',getRandomInteger(1, 10));

// //Bai 3: 
// const array = [176543, 2123456, 36, 1234564, 5675432];
// console.log('Answer 3: ',getRandomElement(array));

// //Bai 4: 
// const arrayFirst = [100, 298765, 345678, 434567, 509876, 'kaka', 'kiki', 'lulu'];
// const arraySecond = [434567, 509876 , 6876543, 78765432, 898765432, 345678, 'lala', 'lulu'];
// console.log('Answer 4: ',findMissingElements(arrayFirst, arraySecond));

