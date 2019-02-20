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
  API_URL:string = "http://USLMAPRAVGANDH2:8080/";
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

  test: string = "Hello";
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) { }

  async getServiceMatrix1 (){
      var self = this;
      alert('Inside service matrix');
      await fetch(this.API_URL+'service')
        .then(function(response) {
        response.json().then(
            function (data) {
              alert('Inside service matrix - inside data');
              debugger;
              console.log(data);
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

   public getData = () => {
     return this.http.get(this.API_URL+'service');
    }

  async getTaskDetail(taskId: string) {
     console.log(`Task Detal json ${this.matrixJsonString}`);
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

    getTaskDetail1 = (taskId: string) => {
       return this.http.get('../assets/data0.json');
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
                 console.log(self.taskInfo.service.category.task.laborClass);
                 self.laborDataStore = new MatTableDataSource(self.taskInfo.service.category.task.laborClass);
              }
            );
          });
    }


    testBackend (){
          this.http.get('http://USLMAPRAVGANDH2:8080/greeting').toPromise()
            .then(function(response) {
              console.log('inside then');
              console.log(response);
            });
    }

}
