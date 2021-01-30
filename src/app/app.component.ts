import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchText;
  public csvRecords: any[] = [];
  public header: any[] = [];
  public count : number = 10;
  public csvRecordspage: any[] = [];
  pageOfItems: Array<any>;
@ViewChild('fileImportInput') fileImportInput: any;
  fileChangeListener($event: any): void {
    var files = $event.srcElement.files;
    if (files[0].name.endsWith('.csv')) {
      var input = $event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = (data) => {
        let csvData = reader.result;
        let csvRecordsArray = (csvData as string).split(/\r\n|\n/);
        let rowdata = csvRecordsArray[0].match(/(“[^”]*”)|[^,]+/g)
this.header.push(rowdata.filter(e =>  e)) ;
for(let i=1;i<csvRecordsArray.length;i++){
let rowdata = this.CSVtoArray(csvRecordsArray[i]);

this.csvRecords.push(rowdata.filter(e =>  e));
}
this.csvRecordspage= this.csvRecords.slice(0,10);
      };
reader.onerror = function() {
        alert('Unable to read ' + input.files[0]);
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileImportInput.nativeElement.value = '';
     this.csvRecords = [];
    }
}
onChangePage(pageOfItems: Array<any>) {
  // update current page of items
  this.pageOfItems = pageOfItems;
}
nextItem() {
  if(this.count<this.csvRecords.length-10){
  this.csvRecordspage= this.csvRecords.slice(this.count,this.count+10);
  this.count = this.count+10;
  }
}
prevItem() {
  if(this.count>=10){
  this.csvRecordspage= this.csvRecords.slice(this.count-10,this.count);
  this.count = this.count-10;
  }
}

CSVtoArray(text) {
  var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

 

  var a = []; 
  text.replace(re_value, 
      function(m0, m1, m2, m3) {

          
          if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));

          
           if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
          else if (m3 !== undefined) a.push(m3);
          return ''; // Return empty string.
      });

  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('');
  return a;
}
}