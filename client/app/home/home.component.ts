import { Component } from '@angular/core';
import { TaskService } from '../_services/tasks.services';
import { Tasks } from '../_models/Tasks';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html'
})
export class TasksComponent {

  tasks : Tasks[];
  title : string;

  constructor(private taskService : TaskService){
    this.taskService.getTasks()
      .subscribe(tasks => {
        this.tasks = tasks;
      });
  }

  addTask(event:any){
    event.preventDefault();
    var newTask = {
      title: this.title,
      isDone: false
    }
    
    this.taskService.addTask(newTask)
      .subscribe(task => {
        this.tasks.push(task);
        this.title = '';
      })
  }

  deleteTask(id:any){
    var tasks = this.tasks;
    this.taskService.deleteTask(id)
      .subscribe(data => {
        if (data.n == 1){
          for (var i = 0; i < tasks.length;i++){
            if (tasks[i]._id == id)
              tasks.splice(i,1);
          }
        }
      })
  }

  updateStatus(task:any){
    var _task = {
      _id: task._id,
      title: task.title,
      isDone: !task.isDone
    }

    this.taskService.updateStatus(_task)
      .subscribe(data=>{
        task.isDone = !task.isDone;
      })
  }
}