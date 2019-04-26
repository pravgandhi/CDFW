import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ServiceMatrixService {
  matMtrixDataStore;
  matrixJsonString;
  taskInfo;
  laborDataStore;
  selectedRowIndex;
  filterStore: Filters ;
  //API_URL:string = "http://ec2-18-220-6-166.us-east-2.compute.amazonaws.com:8080/";
  API_URL:string = "http://localhost:8080/";
  //API_URL:string = "https://prod.cdfw-sbb.com/";
  //API_URL:string = "https://dev.cdfw-sbb.com/";
   @ViewChild(MatPaginator) paginator: MatPaginator;
  inputDataStore = [{
    id: 1,
    value: "5",
    name: "Bob"
  },
  {
    id: 2,
    value: "3",
    name: "Bob"
  },
  {
    id: 3,
    value: "1",
    name: "Bob"
  },
  {
    id: 4,
    value: "4",
    name: "Bob"
  },
  {
    id: 5,
    value: "2",
    name: "Bob"
  },
  {
    id: 6,
    value: "3",
    name: "Bob"
  }
];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) {
    this.filterStore = new Filters();
  }

  async getServiceMatrix1 (){
      var self = this;
      await fetch(this.API_URL+'service')
        .then(function(response) {
        response.json().then(
            function (data) {
              self.matrixJsonString = data;
              self.matMtrixDataStore = new MatTableDataSource (data);

              self.matMtrixDataStore.paginator = this.paginator;
              self.matMtrixDataStore.sort = this.sort;
            }
          );
          //this.matMtrixDataStore = new MatTableDataSource (this.matrixJsonString);
        });
    // this.matMtrixDataStore = new MatTableDataSource (response);
   }

   public getData = (selectedRegionId: number, userId:string ) => {
     return this.http.get(this.API_URL+'service/'+selectedRegionId+ '/'+ userId);
    }

    public getLaborMappingsData = (selectedRegion: number, userId:string ) => {
      return this.http.get(this.API_URL+'csservice/'+selectedRegion+ '/'+ userId);
    }


  getLaborClassSummary(selectedRegion: number, userId: any, laborClassName: any) {
    return this.http.get(this.API_URL+'csservice/laborclasssummary/'+selectedRegion+ '/'+ userId+ '/'+ laborClassName);
  }

    public getCsMatrixData = () => {
        return this.http.get(this.API_URL+'cslaborhours');
     }

    public selectInput = (regionId: number, taskId: string, userId:string, approvedUserId:any) => {
      return this.http.get(this.API_URL+'selectInput/'+regionId+'/'+ taskId+ '/'+ userId+'/'+approvedUserId);
    }

    public fetchInputs = (regionId: number, taskId : string) => {
      return this.http.get(this.API_URL+'fetchInputs/'+regionId+'/'+taskId);
    }

  async getTaskDetail(taskId: string) {
     var self = this;
     await fetch('../assets/data.json')
       .then(function(response) {
       response.json().then(
           function (data) {
              self.taskInfo = data.find(item => item.taskId === taskId);
           }
         );
       });
    }

    getTaskDetail1 = (selectedRegion: string, taskId :string) => {
      return this.http.get(this.API_URL+selectedRegion+'/task/'+ taskId );
    }

    getRegionDetails = () => {
       return this.http.get('../assets/data.json');
      }

  async getTaskInfo (taskId: string){
        var self = this;
        await fetch('../assets/data.json')
          .then(function(response) {
          response.json().then(
              function (data) {
                 self.taskInfo = data.find(item => item.taskId === taskId);
                 self.laborDataStore = new MatTableDataSource(self.taskInfo.service.category.task.laborClass);
              }
            );
          });
    }

    logout(usrId : string) {
      this.http.post(this.API_URL+"logout", {userId : usrId}).subscribe(res => {
        // console.log(res);
      });
    }


    testBackend (){
          this.http.get('http://localhost:8080/greeting').toPromise()
            .then(function(response) {
            });
    }

    public saveUserInput(userId:number, regionName: string, taskId: string, inputValue: number, taskfeedback: string){
      return this.http.post(this.API_URL+'saveInput', {userId: userId, regionName: regionName, taskId: taskId, inputValue :inputValue,  feedback: taskfeedback });
    }

    public editCSInput(csInput: Object){
      return this.http.post(this.API_URL+'editCsInput', {regionId: csInput['regionId'], userId: csInput['userId'], positionId: csInput['positionId'], taskId: csInput['taskId'], inputHours :csInput['inputHours'] });
    }

    public deleteCSInput(csInput : Object){
      return this.http.post(this.API_URL+'deleteCsInput', {regionId: csInput['regionId'], userId: csInput['userId'], positionId: csInput['positionId'], taskId: csInput['taskId'], inputHours :csInput['inputHours'] });
    }

}


export class Filters {
  pageIndex: number = 0;
  globalFilter : string = '';
  columnFilter : any;
  selectedSubProgTasks: any[] = [];
  pageSize : number = 50;

/*  get pageIndex():number{
    return this.pageIndex;
  } */

}
