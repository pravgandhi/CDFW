import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ServiceMatrixService } from '../service-matrix.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  taskId : string;
  task : Object;
  displayedColumns: string[] = ["title", "role", "time"];
  groups = [
   {
     "name": "pencils",
     "items": ["red pencil","blue pencil","yellow pencil"]
   },
   {
     "name": "rubbers",
     "items": ["big rubber","small rubber"]
   },
] ;

  constructor(private route: ActivatedRoute, private serviceMatrix : ServiceMatrixService) { }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get("id");
    this.serviceMatrix.getTaskInfo(this.taskId);
  }
}
