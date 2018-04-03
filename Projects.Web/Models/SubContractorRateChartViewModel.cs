using Projects.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class SubContractorRateChartViewModel 
    {
        public int id { get; set; } 
        public int tenant_id { get; set; }

        public int projectid { get; set; }

        public int subcontractor_id { get; set; }

        public List<RateChartItems> ratechartdetails { get; set; }
       
    }
}