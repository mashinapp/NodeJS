//задача 1
function adding(num) {
    let summary = num;

    // Функція inner_adding приймає наступне число як параметр
    function inner_adding(nextNum) {
        if (nextNum !== undefined) {
            summary += nextNum;
            return inner_adding; // Повертаємо саму функцію, щоб дозволити подальші виклики
        } else {
            return summary; // Повертаємо суму, коли більше параметрів не передано
        }
    }

    return inner_adding; // Повертаємо функцію inner_adding
}

console.log(adding(2)(5)(7)(1)(6)(5)(11)()); // Викликаємо функцію adding та виконуємо послідовність додавання чисел




//задача 2
function areAnagrams(str1, str2) {
    // Видаляємо зайві пробіли та перетворюємо рядки на масиви символів
    const arr1 = [...str1.replace(/\s/g, '')];
    const arr2 = [...str2.replace(/\s/g, '')];

    // Перевіряємо, чи мають масиви однакову довжину
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Сортуємо масиви символів
    arr1.sort();
    arr2.sort();

    // Перевіряємо, чи є відсортовані масиви однаковими
    for (const [index, char] of arr1.entries()) {
        if (char !== arr2[index]) {
            return false;
        }
    }

    return true; // Якщо усі перевірки пройшли успішно, то рядки є анаграмами
}

// Приклад використання:
const string1 = 'tea';
const string2 = 'eat';

console.log(areAnagrams(string1, string2)); // Виведе true, оскільки "listen" і "silent" є анаграмами




//задача 3
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj; // Якщо obj є простим типом даних або null - повертаємо його без клонування
    }

    let clone; // Змінна clone буде містити клон об'єкта або масива

    if (Array.isArray(obj)) { // Якщо obj є масивом, створюємо новий пустий масив
        clone = [];
        for (let i = 0; i < obj.length; i++) {
            clone[i] = deepClone(obj[i]); // Рекурсивно клонуємо елементи масиву
        }
    } else { // Якщо obj є об'єктом, створюємо новий пустий об'єкт
        clone = {};
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clone[key] = deepClone(obj[key]); // Рекурсивно клонуємо властивості об'єкта
            }
        }
    }

    return clone; // Повертаємо клонований об'єкт або масив
}

const obj = { a: 69, b: { c: 27 } };
const clonedObj = deepClone(obj);
console.log(clonedObj); // Виведе: { a: 69, b: { c: 27 } }
console.log(obj === clonedObj); // Виведе: false



//задача 4
function CachedFuncWrap(fn) {
    const cache = {}; // Об'єкт для збереження кешованих результатів

    return function (...args) {
        const key = JSON.stringify(args); // Створення ключа шляхом серіалізації аргументів функції в рядок

        if (cache[key]) { // Перевіряємо, чи результат кешований за заданим ключем
            console.log('З кешу');
            return cache[key]; // Повертаємо кешований результат
        }

        const result = fn(...args); // Виклик оригінальної функції з переданими аргументами
        cache[key] = result; // Зберігаємо результат в кеші за ключем
        console.log('Обраховано');
        return result; // Повертаємо результат
    };
}


const calc = (a, b, c) => a + b + c;
const cachedCalc = CachedFuncWrap(calc);

console.log(cachedCalc(2, 2, 3)); // Виведе: Обраховано, 7
console.log(cachedCalc(5, 8, 1)); // Виведе: Обраховано, 14
console.log(cachedCalc(2, 2, 3)); // Виведе: З кешу, 7
