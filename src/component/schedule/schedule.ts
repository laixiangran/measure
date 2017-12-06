import {
    Component, Input, Output, EventEmitter,
    OnInit, ViewEncapsulation, ChangeDetectionStrategy
} from '@angular/core';

@Component({
    selector: 'nb-schedule',
    templateUrl: './schedule.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    host: {
        'class': 'nb-widget nb-schedule'
    },
    exportAs: 'nbSchedule'
})
export class ScheduleComponent implements OnInit {
    schedules;
    weekSelect;
    week = ['一', '二', '三', '四', '五', '六', '日'];
    hour = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    hours = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];
    constructor() {
        this.schedules = Array(167).fill(0);
        this.weekSelect = Array(7).fill(0);
    }

    ngOnInit() {

    }
    select(i, j) {
        this.schedules[i*24 + j] = (this.schedules[i*24 + j] + 1) % 2;

        let sum = 0;
        for (let k = i * 24; k < (i + 1) * 24; k++) {
            sum = sum + this.schedules[k];
        }
        if (sum === 0) {
            this.weekSelect[i] = 0;
        } else if (sum === 24) {
            this.weekSelect[i] = 2;
        } else {
            this.weekSelect[i] = 1;
        }
    }
    checkDay(j) {
        this.weekSelect[j] = this.weekSelect[j] > 0 ? 0 : 2;

        let value = parseInt(this.weekSelect[j] / 2);
        for (let i = j * 24; i < (j + 1) * 24; i++) {
            this.schedules[i] = value;
        }
    }
}
