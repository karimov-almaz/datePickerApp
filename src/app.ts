
const moment:any = (window as any).moment;

interface PresetDate {
  name: string;
  dateFrom: Date;
  dateTo: Date;
}

class DatesComponentController implements ng.IComponentController  {

  public date: Date = new Date();
  public dateFrom: string;
  public dateTo: string;
  public presetDates: PresetDate[];
  public mcChange: () => any;

  static $inject = ['$scope'];

  constructor() {
  }

  public $onInit () {
    const msInDay = 3600*24*1000;
    this.presetDates = [
      { name: "yesterday", dateFrom: new Date(+this.date - msInDay), dateTo: new Date(+this.date - msInDay)},
      { name: 'today', dateFrom: this.date, dateTo: this.date },
      { name: '2 weeks', dateFrom: new Date(+this.date - msInDay * 14), dateTo: this.date },
      { name: 'month', dateFrom: new Date(+this.date - msInDay * 30), dateTo: this.date },
      { name: 'all', dateFrom: null, dateTo: null},
    ]
  }

  public changeDate( from?: any , to?: any ){
    if( from === undefined && to === undefined){
      to = this.dateTo;
      from = this.dateFrom;
    }
    if(moment(to) < moment(from)){
      this.dateTo = this.dateFrom;
      alert('dateFrom should be less than dateTo ')
    } else{
      this.dateTo =  to ? moment(to).format('YYYY-MM-DD') : null;
      this.dateFrom = from ? moment(from).format('YYYY-MM-DD') : null;
      this.mcChange();
    }
  }
}

class DatesComponent implements ng.IComponentOptions {

  public bindings: any;
  public controller: ng.Injectable<ng.IControllerConstructor>;
  public controllerAs: string;
  public template: string;

  constructor() {
    this.bindings = {
      dateFrom: '=',
      dateTo: '=',
      mcChange: '&',
    };
    this.controller = DatesComponentController;
    this.controllerAs = "$ctrl";
    this.template = `
      <md-datepicker ng-model="$ctrl.dateFrom" ng-change="$ctrl.changeDate()" md-placeholder="Enter date"></md-datepicker>
      <md-datepicker ng-model="$ctrl.dateTo" ng-change="$ctrl.changeDate()" md-placeholder="Enter date"></md-datepicker>
      <div style="margin-left:20px">
        <a style="margin-right:35px; font-size:12px" ng-repeat="date in $ctrl.presetDates" ng-click="$ctrl.changeDate(date.dateFrom, date.dateTo)">
          {{date.name}}
        </a>
      </div>
    `;
  }
}

class DemonstrationController implements ng.IComponentController {

  public date1: string = null;
  public date2: string = null;
  public mcChange = function() {
    alert(`c ${this.dateFrom} по ${this.dateTo}`);
  }

  constructor() {}

  public $onInit () {
    this.date1 = moment().format('YYYY-MM-DD')
  }
  
}

class Demonstration implements ng.IComponentOptions {

  public controller: ng.Injectable<ng.IControllerConstructor>;
  public controllerAs: string;
  public template: string;

  constructor() {
    this.controller = DemonstrationController;
    this.controllerAs = "$ctrl";
    this.template = `
      <mc-dates date-from="$ctrl.date1" date-to="$ctrl.date2" mc-change="$ctrl.mcChange"></mc-dates>
      <div style="margin-top:50px">
      <md-input-container>
        <label>Date 1</label>
        <input ng-model="$ctrl.date1">
      </md-input-container>
      <md-input-container>
        <label>Date 2</label>
        <input ng-model="$ctrl.date2">
      </md-input-container>
      </div>
    `;
  }
}

angular
  .module("superApp", [ 'ngMaterial' ])
  .component("mcDates", new DatesComponent())
  .component("demon", new Demonstration());

angular.element(document).ready(function() {
  angular.bootstrap(document, ["superApp"]);
});
