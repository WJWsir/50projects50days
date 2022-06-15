let passwordResultSpanEle = document.getElementById("result");
let copyResultToClipboardButtonEle = document.getElementsByClassName("copy-clipboard")[0];
let generatePasswordButtonEle = document.getElementsByClassName("generate")[0];
let passwordLengthTextInputEle = document.getElementById("PdLength");
let uppercaseLetterCheckboxInputEle = document.getElementById("UCaseLetter");
let lowercaseLetterCheckboxInputEle = document.getElementById("LCaseLetter");
let numberCheckboxInputEle = document.getElementById("Num");
let symbolCheckboxInputEle = document.getElementById("Syb");


copyResultToClipboardButtonEle.addEventListener("click", copyResultToClipboard);
generatePasswordButtonEle.addEventListener("click", function () {
    let result = generatePassword(passwordLengthTextInputEle.value,
        uppercaseLetterCheckboxInputEle.checked,
        lowercaseLetterCheckboxInputEle.checked,
        numberCheckboxInputEle.checked,
        symbolCheckboxInputEle.checked);
    passwordResultSpanEle.innerText = result;
});

/**
 * 
 * @param {number} length 生成的密码长度
 * @param {boolean} whetherToIncludeUppercaseLetters 生成的密码是否包含大写字母
 * @param {boolean} whetherToIncludeLowercaseLetters 生成的密码是否包含小写字母
 * @param {boolean} whetherToIncludeNumbers 生成的密码是否包含数字
 * @param {boolean} whetherToIncludeSymbols 生成的密码是否包含特殊符号
 */
function generatePassword(length,
    whetherToIncludeUppercaseLetters,
    whetherToIncludeLowercaseLetters,
    whetherToIncludeNumbers,
    whetherToIncludeSymbols) {
    let result = "";
    let rg = new RandomGenerator({
        whetherToIncludeLowercaseLetters: whetherToIncludeLowercaseLetters,
        whetherToIncludeUppercaseLetters: whetherToIncludeUppercaseLetters,
        whetherToIncludeNumbers: whetherToIncludeNumbers,
        whetherToIncludeSymbols: whetherToIncludeSymbols
    });
    for (let i of range(1, length)) {
        result += rg.generateRandomCharater();
    }
    return result;
}

async function copyResultToClipboard() {
    try {
        /* 1. get password */
        let passwordGenerated = passwordResultSpanEle.textContent;
        /* 2. write password to clipboard */ //ref: https://www.ruanyifeng.com/blog/2021/01/clipboard-api.html
        const clipboardObj = navigator.clipboard;
        await clipboardObj.writeText(passwordGenerated);
        /* 3. prompt success */
        alert("Password copied to clipboard!");
    } catch (err) {
        console.error("Fail to copy password generated:", err);
    }
}

// range 1 to n 可参考
// var result = range(9, 18); // [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
}

let Counter = (function () {
    function _counter() {
        this.start = 1;
    };
    _counter.prototype.next = function () { return this.start++; };
    _counter.prototype.getCurrentCount = function () { return this.start - 1; }
    return _counter;
})();

let RandomGenerator = (function () {
    // ASCII Table //ref: https://c.runoob.com/front-end/6318/
    const CODE_OF_A = 65;
    const CODE_OF_Z = 90;
    const CODE_OF_a = 97;
    const CODE_OF_z = 122;
    const CODE_OF_0 = 48;
    const CODE_OF_9 = 57;

    /** 构建特殊字符ASCII编码码号数组
    * 约定特殊字符取 ASCII Table 编码十进制表示范围在
    *  33-47
       58-64
       91-96
       123-126
    */
    let symbolsCodeArr = (range(33, 47))// !"#$%&'()*+,-./
        .concat(range(58, 64))// :;<=>?@
        .concat(range(91, 96))// [\]^_`
        .concat(range(123, 126))// {|}~
        ;
    /**
     * 以下函数随机返回 min（包含）～ max（包含）之间的数字：//ref: https://www.runoob.com/jsref/jsref-random.html
     * @param {number} min 最小整数值
     * @param {number} max 最大整数值
     * @returns 
     */
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function _randomGenerator(data) {
        this.whetherToIncludeLowercaseLetters = data.whetherToIncludeLowercaseLetters;
        this.whetherToIncludeUppercaseLetters = data.whetherToIncludeUppercaseLetters;
        this.whetherToIncludeNumbers = data.whetherToIncludeNumbers;
        this.whetherToIncludeSymbols = data.whetherToIncludeSymbols;

        this.counter = new Counter();
        this.dict = {};
        if (this.whetherToIncludeLowercaseLetters)
            this.dict[this.counter.next()] = this.generateRandomLowercaseLetter;
        if (this.whetherToIncludeUppercaseLetters)
            this.dict[this.counter.next()] = this.generateRandomUppercaseLetter;
        if (this.whetherToIncludeNumbers)
            this.dict[this.counter.next()] = this.generateRandomNumber;
        if (this.whetherToIncludeSymbols)
            this.dict[this.counter.next()] = this.generateRandomSymbol;
    }
    /**
     * 
     * @returns 随机大写字母
     */
    _randomGenerator.prototype.generateRandomUppercaseLetter = () => {
        return String.fromCharCode(getRndInteger(CODE_OF_A, CODE_OF_Z));
    };
    /**
     * 
     * @returns 随机小写字母
     */
    _randomGenerator.prototype.generateRandomLowercaseLetter = () => {
        return String.fromCharCode(getRndInteger(CODE_OF_a, CODE_OF_z));
    };
    /**
     * 
     * @returns 随机数字
     */
    _randomGenerator.prototype.generateRandomNumber = () => {
        return String.fromCharCode(getRndInteger(CODE_OF_0, CODE_OF_9));
    };
    /**
     * 
     * @returns 随机字符
     */
    _randomGenerator.prototype.generateRandomSymbol = () => {
        return String.fromCharCode(symbolsCodeArr[getRndInteger(0, symbolsCodeArr.length - 1)]);
    };
    /**
     * 
     * @returns 返回随机字符
     */
    _randomGenerator.prototype.generateRandomCharater = function () {
        if(Object.prototype.isPrototypeOf(this.dict) && Object.keys(this.dict).length === 0) return "";// 参考 空对象判别 ref： https://cloud.tencent.com/developer/article/1743491
        return this.dict[getRndInteger(1, this.counter.getCurrentCount())].apply(this);// 参考 零合并操作符 ?? 与 可选链操作符 ?. ref: https://segmentfault.com/a/1190000039008417
    };
    return _randomGenerator;
})();