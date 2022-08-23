import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { IDailyStatics } from '../../models/IDailyStatics.interface';
import { ISearchModel } from '../../models/ISearchModel.interface';
import { StaticsService } from '../../services/statics.service';
@Component({
  selector: 'app-mixed-widget11',
  templateUrl: './mixed-widget11.component.html',
})
export class MixedWidget11Component implements OnInit {
  @Input() chartColor: string = '';
  @Input() chartHeight: string;
  chartOptions: any = {};
companyName:string;

  constructor(private auth:AuthService, private datePipe: DatePipe, private service: StaticsService) {}

  ngOnInit(): void {
		this.auth.userData.subscribe((data) => {

			let model: ISearchModel = { CompanyId: data.companyId } as ISearchModel;
			model.StartDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy')!;
			model.EndDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy')!;

			this.service.getDailyStatic(model).subscribe((dataa: IDailyStatics[]) => {
				this.companyName = dataa[0].companyName;
				this.chartOptions = getChartOptions(this.chartHeight, this.chartColor, dataa );
			});
		});

    
  }
}

function getChartOptions(chartHeight: string, chartColor: string,dataa:IDailyStatics[]) {
  const labelColor = getCSSVariableValue('--bs-gray-500');
  const borderColor = getCSSVariableValue('--bs-gray-200');
  const secondaryColor = getCSSVariableValue('--bs-gray-300');
  const baseColor = getCSSVariableValue('--bs-' + chartColor);

  return {
    series: [
      {
        name: 'العدد ',
        data: [dataa[0].complaintsCount, dataa[0].meterReadingsCount, dataa[0].updatedCustomersCount],
      },
    
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['الشكاوى', 'قراءة العداد', 'تعديلات العملاء'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: 'solid',
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return  val;
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}
