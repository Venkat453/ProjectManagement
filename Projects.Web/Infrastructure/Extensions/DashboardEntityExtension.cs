using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class DashboardEntityExtension
    {
        public static void addChartorder(this tbl_chartsorder Chartorder, ChartOrderViewModel chartorderVM)

        {
            Chartorder.userid = chartorderVM.userid;
            Chartorder.user_name = chartorderVM.user_name;
            Chartorder.charts_order = "1,2,3,4,5,6"; 
        }
    }
}