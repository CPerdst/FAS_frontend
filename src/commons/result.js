interface result {
    code: number;
    msg: string;
}

class success implements result {
    code: number;
    msg: string;

    constructor() {
        this.code = 1;
        this.msg = "成功";
    }

}