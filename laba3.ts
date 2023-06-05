// Задача 1: Функція add для додавання чисел

function adding(num: number): (nextNum?: number) => number | ((nextNum: number) => number | number) {
    let summary: number = num;

    // Функція inner_adding приймає наступне число як параметр
    function inner_adding(nextNum?: number): number | ((nextNum: number) => number | number) {
        if (nextNum !== undefined) {
            summary += nextNum;
            return inner_adding; // Повертаємо саму функцію, щоб дозволити подальші виклики
        } else {
            return summary; // Повертаємо суму, коли більше параметрів не передано
        }
    }

    return inner_adding; // Повертаємо функцію inner_adding
}

console.log(adding(2)(5)(7)(1)(6)(5)(11)());



// Задача 2: Перевірка на анаграми (typescript)

function areAnagrams(str1: string, str2: string): boolean {
    const arr1: string[] = [...str1.replace(/\s/g, '')];
    const arr2: string[] = [...str2.replace(/\s/g, '')];


    if (arr1.length !== arr2.length) {
        return false;
    }

    arr1.sort();
    arr2.sort();

    for (const [index, char] of arr1.entries()) {
        if (char !== arr2[index]) {
            return false;
        }
    }

    return true;
}

const string1: string = 'tea';
const string2: string = 'eat';

console.log(areAnagrams(string1, string2)); // Виведе true, оскільки "tea" і "eat" є анаграмами




// Задача 3: Глибоке клонування (typescript)

function deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    let clone: any;

    if (Array.isArray(obj)) {
        clone = [];
        for (let i = 0; i < obj.length; i++) {
            clone[i] = deepClone(obj[i]);
        }
    } else {
        clone = {};
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clone[key] = deepClone(obj[key]);
            }
        }
    }

    return clone;
}

const obj: Record<string, any> = { a: 69, b: { c: 27 } };
const clonedObj: Record<string, any> = deepClone(obj);
console.log(clonedObj); // Виведе: { a: 69, b: { c: 27 } }
console.log(obj === clonedObj); // Виведе: false




// Задача 4: Кешування результатів функції

function wrapper(func: (...args: number[]) => number): (...args: number[]) => number {
    const cache: Record<string, number> = {}; // Об'єкт для зберігання кешованих результатів


    return (...args: number[]) => {
        const key = args.join(',');  // Створюємо ключ на основі аргументів

        if (cache.hasOwnProperty(key)) {  // Перевіряємо, чи є результат у кеші
            console.log(`Using cached result for (${args.join(', ')})`);
            return cache[key]; // Повертаємо кешований результат
        }

        const result = func(...args);  // Викликаємо оригінальну функцію
        cache[key] = result;  // Зберігаємо результат у кеші
        console.log(`Calculating result for (${args.join(', ')})`);
        return result; // Повертаємо результат
    }
}

const add = (a: number, b: number, c: number) => a + b + c;
const cachedAdd = wrapper(add);

console.log(cachedAdd(2, 2, 3)); // Calculating result for (2, 2, 3) -> 7
console.log(cachedAdd(5, 8, 1)); // Calculating result for (5, 8, 1) -> 14
console.log(cachedAdd(2, 2, 3)); // Using cached result for (2, 2, 3) -> 7