export class Song {

    constructor(public songId: string,
        public artistName: string,
        public songName: string,
        public rank: number,
        public isSelected: boolean = false,
        public duration: number, public image: string, public songIndex: number) {

    }


}