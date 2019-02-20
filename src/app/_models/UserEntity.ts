
import { Deserializable } from './Deserializable';

export class UserEntity implements Deserializable {
    id: number;
    userName: string;
    userToken:string;
    userRoleByRoleId: UserRoleEntity;
    dataTypeByDataTypeId : DataTypeEntity;
    regionByRegionId: RegionEntity;

    deserialize(input: any) {
      Object.assign(this, input);
      return this;
    }

    constructor(obj?: any) {
        Object.assign(this, obj);
    }

}

class UserRoleEntity {
    roleId:number;
    roleName:string;
}

class DataTypeEntity {
   dataTypeId:number;
   dataType:string;
}

class RegionEntity {
  regionId:number;
  regionName: string;
}
