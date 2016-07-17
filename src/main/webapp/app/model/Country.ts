import {Playlist} from './Models';

export class Country {

    public checked: boolean;
    public playlists:Array<Playlist>;
    public genres:Array<string>;

    constructor(public countryCode: string,
        public country: string,
        public imageUrl: string
    ) {

    }


}