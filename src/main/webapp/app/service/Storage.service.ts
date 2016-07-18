import { Injectable} from '@angular/core';

@Injectable()
export class StorageService {
    private _selectedCountriesKey = "selectedCountries"; 
    constructor() {
    }

    isNewUser(): boolean {
        if (!this.get('userId')) {
            return true;
        }
        return false;
    }

    isAdmin(): boolean {
        if (this.get('admin')) {
            return true;
        }
        return false;
    }

    getSelectedCountries() {
        return this.get(this._selectedCountriesKey) ? this.get(this._selectedCountriesKey) : [];
    }

    removeCountry(country:String) {
        let selectedCountries = this.getSelectedCountries();
        if (_.contains(selectedCountries, country)) {
            selectedCountries = _.without(selectedCountries, country);
            this.put(this._selectedCountriesKey, selectedCountries);
        }        
    }

    addCountry(country: String) {
        let selectedCountries = this.getSelectedCountries();
        if (!_.contains(selectedCountries, country)) {
            selectedCountries.push(country);
            this.put(this._selectedCountriesKey, selectedCountries);
        }
    }

    put(key: string, data: any) {
        Lockr.set(key, data);
    }

    get(key: string): any {
        return Lockr.get(key);
    }

    remove(key: string) {
        Lockr.rm(key);
    }

    flush() {
        Lockr.flush();
    }

}