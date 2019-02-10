import { Injectable, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ServiceMatrixService {
  matMtrixDataStore;
  matrixJsonString;
  taskInfo;
  laborDataStore;

  test: string = "Hello";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient) { }

  async getServiceMatrix1 (){
      var self = this;
      await fetch('../assets/data.json')
        .then(function(response) {
        response.json().then(
            function (data) {
              console.log(data);
              self.matMtrixDataStore = new MatTableDataSource (data);
              self.matrixJsonString = data;
            }
          );
          //this.matMtrixDataStore = new MatTableDataSource (this.matrixJsonString);
        });
    // this.matMtrixDataStore = new MatTableDataSource (response);
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

  async getTaskInfo (taskId: string){
      if(typeof this.matrixJsonString === 'undefined') {
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
      } else {
        this.taskInfo = this.matrixJsonString.find(item => item.taskId === taskId);
      }
    }

}
