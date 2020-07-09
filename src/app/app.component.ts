import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from './data.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  providers: [DataService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'HeatMap';
  //-----Declarar variables utilizadas.
  hostElement; // Native element hosting the SVG container
  svg; // Top level SVG element
  g; // SVG Group element
  data;
  viewBoxHeight;
  viewBoxWidth;
  margin;
  width;
  height;
  public contenido;

  @ViewChild('popover', { static: false }) public popover: NgbPopover;


  constructor(public service: DataService, private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit() {
    //Obtener datos
    this.data = this.service.getData();
    this.createChart()
  }

  createChart() {
    this.removeExistingChartFromParent()
    this.setChartDimension()
    this.initProperties()

    //Crear Rectangulo prueba
    /*   this.svg.append("rect")
         .attr("class", "prueba")
         .attr("transform", `translate(50,50)`)
         .attr("fill", "black")
         .attr("pointer-events", "all")
         .attr("width", 30)
         .attr("height", 30)
         .attr("cursor", "pointer")
         .on("click", () => { this.showPopOver(this.data) });
   */
    //----------------------

    var data = [
      [{
        name: "1",
        value: "0.2"
      }, {
        name: "2",
        value: "3.9"
      }, {
        name: "3",
        value: "59.3"
      }, {
        name: "4",
        value: "36.6"
      }],
      [{
        name: "1",
        value: "0.0"
      }, {
        name: "2",
        value: "3.9"
      }, {
        name: "3",
        value: "38.2"
      }, {
        name: "4",
        value: "57.9"
      }],
      [{
        name: "1",
        value: "0.0"
      }, {
        name: "2",
        value: "26.0"
      }, {
        name: "3",
        value: "73.0"
      }, {
        name: "4",
        value: "1.0"
      }]]

    let n = this.width / 8; //Separación entre cada grafica

    var xScale = d3.scaleBand()
      .domain(data[0].map(d => (d.name)))
      .range([0, this.width / 3 - n]);

    var yScale = d3.scaleLinear()
      .domain([0, 80])
      .range([this.height, 0]);

    var linearColorScale = d3.scaleOrdinal()
      .domain([1, 2, 3, 4])
      .range(["#606060", "#555555", "#7E7E7E", "#A7A7A7"]);

    var xAxis = d3.axisBottom(xScale)


    var yAxis = d3.axisLeft(yScale)


    var yGridLine = d3.axisLeft()
      .scale(yScale)
      .tickSize(-this.width, 0, 0)
      .tickFormat("")

    var ordinalColorScale = d3.scaleOrdinal(d3.schemeCategory10);
    //----Grid Lines 
    this.svg.append("g")
      .classed("gridLine", true)
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
      .call(yGridLine);
    //----   

    //--- Eje Y     
    this.svg.append("g")
      .classed("axis", true)
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top}  )`)
      .call(yAxis).selectAll("text")
      .attr("class", "text-less");
    //-----
    this.svg.selectAll(".scaleLabel")
      .data([{ value: "MEJOR PRÁCTICA", x: 1 }, { value: "CONFIGURADAS", x: 3 }, { value: "ACTIVAS", x: 5 }])
      .enter().append("text")
      .attr("class", "text-less")
      .text((d) => { return d.value; })
      .attr("x", (d, i) => (this.margin.left + (this.width / 6 * (d.x))))
      .attr("y", this.margin.top + this.height + 35)
      .style("text-anchor", "middle")

      this.svg.selectAll(".scaleLabel")
      .data([{ value: "Porcentaje", x: 1 }])
      .enter().append("text")
      .attr("class", "text-less")
      .text((d) => { return d.value; })
      .style("text-anchor", "middle")
      .attr("transform", `translate(${this.margin.left/3},${this.margin.top + this.height/2}) rotate(270)`)
     // .attr("transform","rotate(90)")


    this.svg.selectAll(".scaleLabel")
      .data([{ value: 1883, x: 1 }, { value: 178, x: 3 }, { value: 100, x: 5 }])
      .enter().append("text")
      .attr("class", "text-bold")
      .text((d) => { return d.value; })
      .attr("x", (d, i) => (this.margin.left + (this.width / 6 * (d.x))))
      .attr("y", this.margin.top + this.height + 55)
      .style("text-anchor", "middle")
    ///---------------------------------
    data.forEach((elem, i) => {

      //----Eje X
      this.svg.append("g")
        .classed("axis", true)
        .attr("transform", `translate(${this.margin.left + n / 2 + (xScale(4) + xScale.bandwidth() + n) * i}, ${this.height + this.margin.top}  )`)
        .call(xAxis)
        .selectAll("text")
        .attr("class", "text-less")
      // .text(d => (d.substr(0, 1)))


      this.svg.selectAll(".Retcs")
        .data(elem)
        .enter().append("rect")
        .attr("x", (d) => (this.margin.left + n / 2 + (xScale(4) + xScale.bandwidth() + n) * i + xScale(d.name)))
        .attr("y", d => (this.margin.top + yScale(d.value)))
        .attr("width", xScale.bandwidth())
        .attr("height", d => (this.height - yScale(d.value)))
        .style("fill", (d) => (linearColorScale(d.name)))
      this.svg.selectAll(".valueLabel")
        .data(elem)
        .enter().append("text")
        .attr("class", "text-less")
        .text((d) => { return Math.round(d.value) + " %"; })
        .attr("x", (d) => (xScale.bandwidth() / 2 + this.margin.left + n / 2 + (xScale(4) + xScale.bandwidth() + n) * i + xScale(d.name)))
        .attr("y", d => (this.margin.top + yScale(d.value) - 5))
        .style("text-anchor", "middle")

    });





    this.svg.append("line")          // attach a line
      .style("stroke", "black")  // colour the line
      .attr("x1", this.margin.left + xScale(4) + xScale.bandwidth() + n)     // x position of the first end of the line
      .attr("y1", this.margin.top)      // y position of the first end of the line
      .attr("x2", this.margin.left + xScale(4) + xScale.bandwidth() + n)     // x position of the second end of the line
      .attr("y2", this.margin.top + this.height);    // y position of the second end of the line

    //-------------------SÍMBOLOS
    this.svg.append("svg")
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", this.margin.left +20+ (this.width / 6 * (3)))
      .attr("y", this.margin.top + this.height + 44)
      .attr("viewBox", "0 0 24 24")
      .attr("fill", "none")
      .append("path")
      .attr("d", "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z")
      .attr("stroke", "#7FD8A6")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("fill", "none");

      //<line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    var mysvg= this.svg.append("svg")
    .attr("class","svgD")
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", this.margin.left +20+ (this.width / 6 * (5)))
      .attr("y", this.margin.top + this.height + 44)
      .attr("viewBox", "0 0 24 24")
      .attr("stroke", "#d9534f")
      .attr("shape-rendering","geometricPrecision")
      .append("path")
      .attr("d", "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("fill", "none")
      .attr("shape-rendering","geometricPrecision")

     d3.select(".svgD").append("line")
      .attr("x1",12)     
      .attr("y1",9)      
      .attr("x2", 12)    
      .attr("y2", 13)        
      .attr("stroke-width", 2)    
      .attr("shape-rendering","geometricPrecision")
      d3.select(".svgD").append("line")
      .attr("x1",12)     
      .attr("y1",17)      
      .attr("x2", 13)    
      .attr("y2", 17) 
      .attr("stroke-width", 2)
      .attr("shape-rendering","geometricPrecision")
      
    

  }//FinCreateChart

  private removeExistingChartFromParent() {
    // !!!!Caution!!!
    // Make sure not to do;
    //     d3.select('svg').remove();
    // That will clear all other SVG elements in the DOM
    d3.select(this.hostElement).select('svg').remove();
  }//Fin removeexistingChart

  private setChartDimension() {
    // Se hace responsive el svg  setChartDimension()
    this.viewBoxHeight = 300;
    this.viewBoxWidth = 600;
    this.svg = d3.select(this.hostElement).append('svg')
      .attr('width', this.viewBoxWidth)
      .attr('height', this.viewBoxHeight)
    //Responsive
    /*.attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 ' + this.viewBoxWidth + ' ' + this.viewBoxHeight);*/
    //-----------------------------------------------------------------------
    // Agregar elemento grafico   
    this.g = this.svg.append("g")
      .attr("transform", "translate(0,0)");
  }//Fin setChart

  private initProperties() {

    //---Inicializar propiedades
    this.margin = ({ top: 20, right: 30, bottom: 80, left: 50 })
    this.width = this.viewBoxWidth - this.margin.left - this.margin.right;
    this.height = this.viewBoxHeight - this.margin.top - this.margin.bottom;

  }//Fin init
  private showPopOver(data) {
    // console.log("." + this.filterName(name))
    // console.log(new ElementRef (d3.selectAll(".prueba")))


    this.contenido = data;

    this.popover._elementRef = new ElementRef(d3.selectAll(".prueba").node());//"." + this.filterName(data.name)).node());
    // console.log(this.popover.isOpen())
    if (this.popover.isOpen()) this.popover.close;
    else this.popover.open();
    //setTimeout(() => {this.popover.open();},1000)

    //console.log(this.popover)
  }//Fin showPopOver

}
