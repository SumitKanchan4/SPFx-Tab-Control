export default class TabHelper {

    /**
     * Generates new GUID
     */
    public get generateGuid(): string {
        return [this.gen(2), this.gen(1), this.gen(1), this.gen(1), this.gen(3)].join("-");
    }

    private gen(count: number): string {
        let out: string = "";
        for (let i: number = 0; i < count; i++) {
            // tslint:disable-next-line:no-bitwise
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
    }
}