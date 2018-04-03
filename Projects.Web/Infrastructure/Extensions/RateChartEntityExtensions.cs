using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class RateChartEntityExtensions
    {
        public static void Addratechart(this tbl_subcontractor_ratechart ratechart, SubContractorRateChartViewModel ratechartVm)
        {
            ratechart.tenant_id = ratechartVm.tenant_id;
            ratechart.projectid = ratechartVm.projectid;
            ratechart.subcontractor_id = ratechartVm.subcontractor_id; 
        }

        public static void AddratechartItems(this tbl_subcontractor_ratechart ratechart, RateChartItems ratechartItemsVm)
        {
            ratechart.fieldwork_id = ratechartItemsVm.fieldwork_id;
            ratechart.fieldwork_description= ratechartItemsVm.fieldwork_description;
            ratechart.unitofmeasurement = ratechartItemsVm.unitofmeasurement;
            ratechart.price = ratechartItemsVm.price;
        }
    }
}