export interface ISample {
    id: number
    filename: string
    fileSize: number
    fileMd5: string
    disposeStatus: number
    createTime: Array<number>
}

export class Sample implements ISample {
    id: number
    filename: string
    fileSize: number
    fileMd5: string
    disposeStatus: number
    createTime: Array<number>


    constructor(id: number) {
        this.id = id
    }


}