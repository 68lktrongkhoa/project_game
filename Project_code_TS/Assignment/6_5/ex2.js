// Bài 1: Tính tổ hợp C(n, k)
function combination(n, k) {
    if (
        typeof n !== 'number' || typeof k !== 'number' ||
        !Number.isInteger(n) || !Number.isInteger(k) ||
        n < 0 || k < 0 || k > n
    ) {
        console.warn('Invalid input for combination. n and k must be non-negative integers, and k ≤ n.');
        return 0;
    }

    k = Math.min(k, n - k);  
    let result = 1;

    for (let i = 1; i <= k; i++) {
        result *= (n - (k - i));
        result /= i;
    }

    return result;
}


// Bài 2: Lấy số nguyên ngẫu nhiên trong khoảng min, max
function getRandomInteger(min, max) {
    if (
        typeof min !== 'number' || typeof max !== 'number' ||
        !Number.isInteger(min) || !Number.isInteger(max) ||
        min > max
    ) {
        console.warn('Invalid input for getRandomInteger. min and max must be integers and min ≤ max.');
        return null;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Bài 3: Lấy phần tử ngẫu nhiên từ mảng
function getRandomElement(arr) {
    if (!Array.isArray(arr)) {
        console.warn('Invalid input for getRandomElement. Expected an array.');
        return null;
    }
    if (arr.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}


// Bài 4: Tìm phần tử có trong arr2 nhưng không có trong arr1
function findMissingElements(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        console.warn('Invalid input for findMissingElements. Both inputs must be arrays.');
        return [];
    }

    return arr2.filter(element => !arr1.includes(element));
}


// ----------------------
// Chạy thử từng bài:
// // Bài 1
// console.log('Answer 1: ', combination(5, 2));  // 10

// Bài 2
console.log('Answer 2: ', getRandomInteger(1, '10'));

// Bài 3
// const array = [176543, 2123456, 36, 1234564, 5675432];
// console.log('Answer 3: ', getRandomElement(array));

// Bài 4
// const arrayFirst = [100, 298765, 345678, 434567, 509876, 'kaka', 'kiki', 'lulu'];
// const arraySecond = [434567, 509876 , 6876543, 78765432, 898765432, 345678, 'lala', 'lulu'];
// console.log('Answer 4: ', findMissingElements(arrayFirst, arraySecond));
