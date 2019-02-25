import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    get user():Object{
      return JSON.parse(localStorage.getItem('currentUser'));
    }

    get userId():Object{
      return JSON.parse(localStorage.getItem('currentUser'))['id'];
    }

    getSelectedRegionObject(selectedRegion:string): any {
      if(localStorage.getItem('currentUser') != null || localStorage.getItem('currentUser') != undefined){
        let userRegionMapping = this.user['userRegionMappingsById'];
        for(let userRegion of userRegionMapping) {
          if(selectedRegion === userRegion['regionByRegionId']['regionName']){
            return userRegion['regionByRegionId'];
          }
        }
      }
      return null;
    }

    get userRole():string{
      return JSON.parse(localStorage.getItem('currentUser'))['userRoleByRoleId']['roleName'];
    }

    getUser() {
        return this.http.get<User[]>(`/users`);
    }

    getById(id: number) {
        return this.http.get(`/users/` + id);
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`/users/` + id);
    }
}
