import * as os from "node:os";
import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";
import * as si from 'systeminformation';
import * as promptSync from 'prompt-sync';

const customPrompt = promptSync();

// Функція для послідовного виконання функції для кожного елемента масиву
const runSequential = async <T, K>(arr: T[], callback: (item?: T, index?: number, array?: T[]) => K) =>
    arr.map((...args) => Promise.resolve(callback(...args)));

// Основна функція
const main = async () => {
    const array: Array<string> = ["one", "two", "three"];
    const results = await runSequential(array, (item, index) =>
        Promise.resolve({
            item,
            index,
        })
    );
    console.log(results);
}

// Функція для зміни та видалення елементів масиву на основі умови
const arrayChangeDelete = <T>(arr: T[], predicate: (item: T) => boolean): T[] => arr
    .reduce((acc, curr, i) =>
        (predicate(curr) ? (acc[1].push(arr.splice(i--, 1)[0]), acc) : acc), [[], []] as [T[], T[]])[1];

// Функція для отримання вмісту HTML-сторінок зі списку URL-адрес
const getHtmlContent = () => {
    const fileName: string = customPrompt(`Введіть назву файлу: `);

    fs.readFile(fileName, utf-8, (err, data) => {
        const urls = JSON.parse(data) as string[];
        const outputDirName = path.parse(fileName).name + "_pages";

        if (!fs.existsSync(outputDirName))
            fs.mkdirSync(outputDirName);

        urls.forEach((url, index) => {
            const outputFileName = path.join(outputDirName, `page_${index}.html`);

            https
                .get(url, res => {
                    const fileStream = fs.createWriteStream(outputFileName);
                    res.pipe(fileStream);

                    console.log(res.statusCode);

                    fileStream.on("finish", () => {
                        console.log(`Сторінку збережено у файл ${outputFileName}`);
                    });
                })
                .on(`error`, (err) => {
                    console.log(err);
                });
        });

    });
};

// Функція для виведення системної інформації з заданою частотою
const displaySystemInfo = () => {
    const frequency: number = 100;

    setInterval(async () => {
        const cpuTemperature = (await si.cpuTemperature()).main;
        const mem = await si.mem();
        const graphics = await si.graphics();
        const battery = await si.battery();

        console.log(`
      Операційна система: ${os.platform}
      Архітектура: ${os.arch()}
      Ім'я користувача: ${os.userInfo().username}
      Модель процесора: ${os.cpus()[0].model}
      Температура процесора: ${cpuTemperature} °C
      Загальна пам'ять: ${mem.total}
      Вільна пам'ять: ${mem.free}
      Використана пам'ять: ${mem.used}
      Заряджання батареї: ${battery.isCharging ? "Так" : "Ні"}
      Заряд батареї: ${battery.percent}
      Залишковий час роботи від батареї: ${battery.timeRemaining}
    `);

        graphics.controllers.forEach(controller => console.log(`Графічний контролер: ${controller.vendor}`));

    }, frequency);
}

// Клас для реалізації простого емітера подій
class EventEmitter<T> {
    private readonly _listeners: Map<string, ((args?: T) => void)[]> = new Map();

    registerListener(name: string, listener: (args?: T) => void) {
        const listeners = this._listeners.get(name);
        if (!listeners)
            this._listeners.set(name, [listener]);
        else
            listeners.push(listener);
    }

    emitEvent(name: string, args?: T) {
        const listeners = this._listeners.get(name);
        if (listeners)
            listeners.forEach(listener => listener(args));
    }
}

/*
const emitter = new EventEmitter();
emitter.registerListener('userUpdated', () => console.log('Користувацький обліковий запис оновлено'));
emitter.emitEvent('userUpdated'); // Користувацький обліковий запис оновлено
*/

// Виклик функцій
main();
// arrayChangeDelete();
// getHtmlContent();
// displaySystemInfo();