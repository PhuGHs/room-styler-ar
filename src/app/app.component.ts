import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { locationTopic, messageTopic } from './stomp.cfg';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private stomp: RxStompService) {}
  ngOnInit(): void {
    this.stomp.watch(locationTopic + '1').subscribe(content => console.log("MESSAGE:", content.body));
    this.stomp.watch(messageTopic + '1').subscribe(content => console.log("MESSAGE:", content.body));
  }
  title = 'Roomify';
}
