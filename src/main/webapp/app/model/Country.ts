import {Playlist} from './Models';

export class Country {

    public checked: boolean;
    public playlists:Array<Playlist>;

    constructor(public countryCode: string,
        public country: string,
        public imageUrl: string
    ) {

    }


}