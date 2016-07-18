import {Playlist, Artist} from './Models';

export class Country {

    public checked: boolean;
    public playlists:Array<Playlist>;
    public genres:Array<string>;
    public album:Array<string>;
    public artists:Array<Artist>;

    constructor(public countryCode: string,
        public country: string,
        public imageUrl: string
    ) {

    }


}